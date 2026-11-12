import React, { useEffect, useState } from 'react';
import api from '../api';
import ResourceTable from '../components/ResourceTable';

const manufacturerColumns = [
    { key: 'name', label: 'Name' },
];

const manufacturerFields = [
    { name: 'name', label: 'Name' },
];

function mapManufacture(manufacture) {
    return {
        id: manufacture.id,
        name: manufacture.name ?? '',
    };
}

function cleanFilters(filters) {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== undefined),
    );
}

async function listManufactures() {
    const response = await api.get('/manufacture');
    const manufactures = Array.isArray(response.data) ? response.data : [];

    return manufactures.map(mapManufacture);
}

async function searchManufactures(term) {
    const response = await api.get('/manufacture/search', { params: { term } });
    const manufactures = Array.isArray(response.data) ? response.data : [];

    return manufactures.map(mapManufacture);
}

async function filterManufactures(filters) {
    const response = await api.get('/manufacture/filter', { params: cleanFilters(filters) });
    const manufactures = Array.isArray(response.data) ? response.data : [];

    return manufactures.map(mapManufacture);
}

async function createManufacture(values) {
    const response = await api.post('/manufacture', {
        name: values.name,
    });

    return mapManufacture(response.data);
}

async function updateManufacture(values) {
    await api.put('/manufacture', {
        manufacture_id: values.id,
        data: {
            name: values.name,
        },
    });

    return mapManufacture(values);
}

async function deleteManufacture(row) {
    await api.delete('/manufacture', {
        data: {
            manufacture_id: row.id,
        },
    });
}

const manufacturerActions = {
    list: listManufactures,
    search: searchManufactures,
    filter: filterManufactures,
    create: createManufacture,
    update: updateManufacture,
    delete: deleteManufacture,
};

export default function Manufacturers() {
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        listManufactures()
            .then((nextRows) => {
                setRows(nextRows);
                setReady(true);
            })
            .catch(() => setError('Could not load manufacturers'));
    }, []);

    if (error) {
        return <p className="empty-cell">{error}</p>;
    }

    if (!ready) {
        return <p className="empty-cell">Loading…</p>;
    }

    return (
        <ResourceTable
            title="All manufacturers"
            columns={manufacturerColumns}
            fields={manufacturerFields}
            filterFields={manufacturerFields}
            initialRows={rows}
            actions={manufacturerActions}
        />
    );
}
