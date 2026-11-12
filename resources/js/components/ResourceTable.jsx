import React, { useEffect, useRef, useState } from 'react';
import FormModal from './FormModal';
import DeleteModal from './DeleteModal';

function emptyValues(fields) {
    return Object.fromEntries(fields.map((field) => [field.name, field.multiple ? [] : '']));
}

function resolveFieldOptions(field, values) {
    if (!field?.options) {
        return undefined;
    }

    if (typeof field.options === 'function') {
        return field.options(values ?? {});
    }

    return field.options;
}

function cellValue(row, column, fields) {
    const field = fields.find((item) => item.name === column.key);
    const options = resolveFieldOptions(field, row);

    if (options) {
        const option = options.find((item) => String(item.value) === String(row[column.key]));

        return option?.label ?? row[column.key];
    }

    return row[column.key];
}

function requestErrorMessage(error) {
    const data = error?.response?.data;

    if (typeof data?.message === 'string') {
        return data.message;
    }

    if (data?.errors) {
        return Object.values(data.errors).flat().join(' ');
    }

    return 'Request failed';
}

function hasActiveFilters(values) {
    return Object.values(values).some((value) => {
        if (Array.isArray(value)) {
            return value.length > 0;
        }

        return value !== '' && value !== null && value !== undefined;
    });
}

export default function ResourceTable({
    title,
    columns,
    fields,
    filterFields,
    initialRows,
    actions,
    liveFilter = false,
}) {
    const filtersConfig = filterFields ?? [];
    const showSearch = Boolean(actions?.search);
    const showFilters = filtersConfig.length > 0 && Boolean(actions?.filter);
    const [rows, setRows] = useState(initialRows);
    const [formValues, setFormValues] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);
    const [error, setError] = useState(null);
    const [busy, setBusy] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterValues, setFilterValues] = useState(() => emptyValues(filtersConfig));
    const skipNextLiveFilter = useRef(true);
    const filterRequestId = useRef(0);
    const actionsRef = useRef(actions);

    actionsRef.current = actions;

    useEffect(() => {
        setRows(initialRows);
    }, [initialRows]);

    useEffect(() => {
        if (!liveFilter || !actionsRef.current?.filter) {
            return undefined;
        }

        if (skipNextLiveFilter.current) {
            skipNextLiveFilter.current = false;

            return undefined;
        }

        const requestId = ++filterRequestId.current;
        const timer = setTimeout(async () => {
            setBusy(true);
            setError(null);

            try {
                const currentActions = actionsRef.current;
                const nextRows = hasActiveFilters(filterValues)
                    ? await currentActions.filter(filterValues)
                    : await currentActions.list();

                if (requestId === filterRequestId.current) {
                    setRows(nextRows);
                }
            } catch (requestError) {
                if (requestId === filterRequestId.current) {
                    setError(requestErrorMessage(requestError));
                }
            } finally {
                if (requestId === filterRequestId.current) {
                    setBusy(false);
                }
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [filterValues, liveFilter]);

    function clearedValue(fieldName, fieldList) {
        const dependentField = fieldList.find((item) => item.name === fieldName);

        return dependentField?.multiple ? [] : '';
    }

    function changeField(name, value) {
        setFormValues((current) => {
            const field = fields.find((item) => item.name === name);
            const next = { ...current, [name]: value };

            (field?.clears ?? []).forEach((dependent) => {
                next[dependent] = clearedValue(dependent, fields);
            });

            return next;
        });
    }

    function changeFilter(name, value) {
        setFilterValues((current) => {
            const field = filtersConfig.find((item) => item.name === name);
            const next = { ...current, [name]: value };

            (field?.clears ?? []).forEach((dependent) => {
                next[dependent] = clearedValue(dependent, filtersConfig);
            });

            return next;
        });
    }

    function openCreateForm() {
        setFormValues(emptyValues(fields));
    }

    function openEditForm(row) {
        setFormValues({ ...row });
    }

    function openDeleteModal(row) {
        setDeleteItem(row);
    }

    function closeFormModal() {
        setFormValues(null);
    }

    function closeDeleteModal() {
        setDeleteItem(null);
    }

    function handleSearchTermChange(event) {
        setSearchTerm(event.target.value);
    }

    function handleFilterFieldChange(fieldName, event) {
        changeFilter(fieldName, event.target.value);
    }

    async function saveForm() {
        if (!actions?.create || !actions?.update) {
            return;
        }

        setBusy(true);
        setError(null);

        try {
            if (formValues.id) {
                const updatedRow = await actions.update(formValues);
                setRows((current) => current.map((row) => (row.id === formValues.id ? updatedRow : row)));
            } else {
                const createdRow = await actions.create(formValues);
                setRows((current) => [...current, createdRow]);
            }

            setFormValues(null);
        } catch (requestError) {
            setError(requestErrorMessage(requestError));
        } finally {
            setBusy(false);
        }
    }

    async function confirmDelete() {
        if (!actions?.delete || !deleteItem) {
            return;
        }

        setBusy(true);
        setError(null);

        try {
            await actions.delete(deleteItem);
            setRows((current) => current.filter((row) => row.id !== deleteItem.id));
            setDeleteItem(null);
        } catch (requestError) {
            setError(requestErrorMessage(requestError));
        } finally {
            setBusy(false);
        }
    }

    async function runSearch(event) {
        event.preventDefault();

        if (!actions?.search) {
            return;
        }

        setBusy(true);
        setError(null);

        try {
            const nextRows = await actions.search(searchTerm.trim());
            setRows(nextRows);
        } catch (requestError) {
            setError(requestErrorMessage(requestError));
        } finally {
            setBusy(false);
        }
    }

    async function runFilter(event) {
        event.preventDefault();

        if (!actions?.filter || liveFilter) {
            return;
        }

        setBusy(true);
        setError(null);

        try {
            const nextRows = await actions.filter(filterValues);
            setRows(nextRows);
        } catch (requestError) {
            setError(requestErrorMessage(requestError));
        } finally {
            setBusy(false);
        }
    }

    async function resetList() {
        setSearchTerm('');
        setFilterValues(emptyValues(filtersConfig));

        if (liveFilter) {
            return;
        }

        if (!actions?.list) {
            setRows(initialRows);

            return;
        }

        setBusy(true);
        setError(null);

        try {
            const nextRows = await actions.list();
            setRows(nextRows);
        } catch (requestError) {
            setError(requestErrorMessage(requestError));
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="page-stack">
            <div className="section-head">
                <div className="section-copy">
                    <h1 className="section-title">{title}</h1>
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    disabled={busy}
                    onClick={openCreateForm}
                >
                    Create
                </button>
            </div>

            {(showSearch || showFilters) && (
                <div className="toolbar">
                    {showSearch && (
                        <form className="toolbar-row" onSubmit={runSearch}>
                            <label className="field-label toolbar-grow">
                                Search
                                <input
                                    className="field-input"
                                    value={searchTerm}
                                    placeholder="Search…"
                                    onChange={handleSearchTermChange}
                                />
                            </label>
                            <button type="submit" className="btn btn-primary" disabled={busy || !searchTerm.trim()}>
                                Search
                            </button>
                            <button type="button" className="btn btn-secondary" disabled={busy} onClick={resetList}>
                                Reset
                            </button>
                        </form>
                    )}

                    {showFilters && (
                        <form className="page-stack" onSubmit={runFilter}>
                            <div className="toolbar-filters">
                                {filtersConfig.map((field) => {
                                    const options = resolveFieldOptions(field, filterValues);

                                    return (
                                        <label key={field.name} className="field-label">
                                            {field.label}
                                            {options ? (
                                                <select
                                                    className="field-input"
                                                    value={filterValues[field.name] ?? ''}
                                                    onChange={(event) => handleFilterFieldChange(field.name, event)}
                                                >
                                                    <option value="">Any</option>
                                                    {options.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    className="field-input"
                                                    value={filterValues[field.name] ?? ''}
                                                    onChange={(event) => handleFilterFieldChange(field.name, event)}
                                                />
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                            <div className="toolbar-row">
                                {!liveFilter && (
                                    <button type="submit" className="btn btn-secondary" disabled={busy}>
                                        Apply filters
                                    </button>
                                )}
                                {!showSearch && (
                                    <button type="button" className="btn btn-secondary" disabled={busy} onClick={resetList}>
                                        Reset
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            )}

            {error && <p className="empty-cell" style={{ color: 'var(--danger)' }}>{error}</p>}

            <div className="panel">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key}>{column.label}</th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 && (
                            <tr>
                                <td className="empty-cell" colSpan={columns.length + 1}>
                                    No records yet.
                                </td>
                            </tr>
                        )}
                        {rows.map((row) => (
                            <tr key={row.id}>
                                {columns.map((column) => (
                                    <td key={column.key}>{cellValue(row, column, fields)}</td>
                                ))}
                                <td>
                                    <div className="action-row">
                                        <button
                                            type="button"
                                            className="action-link action-edit"
                                            disabled={busy}
                                            onClick={() => openEditForm(row)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="action-link action-delete"
                                            disabled={busy}
                                            onClick={() => openDeleteModal(row)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <FormModal
                title={formValues?.id ? 'Update' : 'Create'}
                fields={fields}
                values={formValues}
                onChange={changeField}
                onClose={closeFormModal}
                onSubmit={saveForm}
            />
            <DeleteModal
                item={deleteItem}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
