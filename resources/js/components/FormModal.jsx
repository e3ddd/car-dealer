import React from 'react';

function stopPropagation(event) {
    event.stopPropagation();
}

export default function FormModal({ title, fields, values, onChange, onClose, onSubmit }) {
    if (!values) {
        return null;
    }

    function handleSubmit(event) {
        event.preventDefault();
        onSubmit();
    }

    function handleFieldChange(fieldName, event) {
        onChange(fieldName, event.target.value);
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <form
                className="modal-card"
                onClick={stopPropagation}
                onSubmit={handleSubmit}
            >
                <div className="section-copy">
                    <p className="eyebrow">{values.id ? 'Edit record' : 'New record'}</p>
                    <h2 className="section-title">{title}</h2>
                </div>
                <div className="field-stack">
                    {fields.map((field) => (
                        <label key={field.name} className="field-label">
                            {field.label}
                            {field.options ? (
                                <select
                                    className="field-input"
                                    name={field.name}
                                    value={values[field.name] ?? ''}
                                    onChange={(event) => handleFieldChange(field.name, event)}
                                >
                                    <option value="">Select...</option>
                                    {field.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    className="field-input"
                                    name={field.name}
                                    value={values[field.name] ?? ''}
                                    onChange={(event) => handleFieldChange(field.name, event)}
                                />
                            )}
                        </label>
                    ))}
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
