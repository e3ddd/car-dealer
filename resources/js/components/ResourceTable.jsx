import React, { useEffect, useState } from 'react';
import FormModal from './FormModal';
import DeleteModal from './DeleteModal';

function emptyValues(fields) {
    return Object.fromEntries(fields.map((field) => [field.name, '']));
}

function cellValue(row, column, fields) {
    const field = fields.find((item) => item.name === column.key);

    if (field?.options) {
        const option = field.options.find((item) => String(item.value) === String(row[column.key]));

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

export default function ResourceTable({ title, columns, fields, filterFields, initialRows, actions }) {
    const filtersConfig = filterFields ?? fields;
    const [rows, setRows] = useState(initialRows);
    const [formValues, setFormValues] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);
    const [error, setError] = useState(null);
    const [busy, setBusy] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterValues, setFilterValues] = useState(() => emptyValues(filtersConfig));

    useEffect(() => {
        setRows(initialRows);
    }, [initialRows]);

    function changeField(name, value) {
        setFormValues((current) => ({ ...current, [name]: value }));
    }

    function changeFilter(name, value) {
        setFilterValues((current) => ({ ...current, [name]: value }));
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

        if (!actions?.filter) {
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

            <div className="toolbar">
                <form className="toolbar-row" onSubmit={runSearch}>
                    <label className="field-label toolbar-grow">
                        Search
                        <input
                            className="field-input"
                            value={searchTerm}
                            placeholder="Search fields, dealer, manufacturer…"
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

                <form className="page-stack" onSubmit={runFilter}>
                    <div className="toolbar-filters">
                        {filtersConfig.map((field) => (
                            <label key={field.name} className="field-label">
                                {field.label}
                                {field.options ? (
                                    <select
                                        className="field-input"
                                        value={filterValues[field.name] ?? ''}
                                        onChange={(event) => handleFilterFieldChange(field.name, event)}
                                    >
                                        <option value="">Any</option>
                                        {field.options.map((option) => (
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
                        ))}
                    </div>
                    <div className="toolbar-row">
                        <button type="submit" className="btn btn-secondary" disabled={busy}>
                            Apply filters
                        </button>
                    </div>
                </form>
            </div>

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
