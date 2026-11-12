import React from 'react';

function stopPropagation(event) {
    event.stopPropagation();
}

export default function DeleteModal({ item, onClose, onConfirm }) {
    if (!item) {
        return null;
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-card" onClick={stopPropagation}>
                <div className="section-copy">
                    <p className="eyebrow">Danger zone</p>
                    <h2 className="section-title">Delete</h2>
                </div>
                <p className="lede">
                    Delete item <strong>#{item.id}</strong>? This only updates the local table for now.
                </p>
                <div className="modal-actions">
                    <button type="button" className="btn btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="button" className="btn btn-danger" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
