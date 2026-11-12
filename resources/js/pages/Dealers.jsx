import React, { useEffect, useState } from 'react';
import api from '../api';
import ResourceTable from '../components/ResourceTable';

const dealerColumns = [
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country' },
    { key: 'manufacture', label: 'Manufacture' },
    { key: 'cars_count', label: 'Cars' },
    { key: 'employees_count', label: 'Employees' },
];

function mapDealer(dealer, manufactureOptions = []) {
    const manufactureOption = manufactureOptions.find(
        (option) => String(option.value) === String(dealer.manufacture_id),
    );

    return {
        id: dealer.id,
        city: dealer.city ?? '',
        country: dealer.country ?? '',
        manufacture_id: String(dealer.manufacture_id ?? ''),
        manufacture: dealer.manufacture?.name ?? manufactureOption?.label ?? `#${dealer.manufacture_id}`,
        cars_count: dealer.cars_count ?? 0,
        employees_count: dealer.employees_count ?? 0,
    };
}

function mapFormDealer(values, manufactureOptions = []) {
    const manufactureOption = manufactureOptions.find(
        (option) => String(option.value) === String(values.manufacture_id),
    );

    return {
        id: values.id,
        city: values.city ?? '',
        country: values.country ?? '',
        manufacture_id: String(values.manufacture_id ?? ''),
        manufacture: manufactureOption?.label ?? values.manufacture ?? `#${values.manufacture_id}`,
        cars_count: values.cars_count ?? 0,
        employees_count: Number(values.employees_count || 0),
    };
}

function cleanFilters(filters) {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== undefined),
    );
}

function mapManufactureOptions(manufactures) {
    return manufactures.map((manufacture) => ({
        value: String(manufacture.id),
        label: manufacture.name ?? `#${manufacture.id}`,
    }));
}

function buildDealerFields(manufactureOptions) {
    return [
        { name: 'city', label: 'City' },
        { name: 'country', label: 'Country' },
        { name: 'manufacture_id', label: 'Manufacture', options: manufactureOptions },
        { name: 'employees_count', label: 'Employees' },
    ];
}

async function listDealers(manufactureOptions) {
    const response = await api.get('/dealer');
    const dealers = Array.isArray(response.data) ? response.data : [];

    return dealers.map((dealer) => mapDealer(dealer, manufactureOptions));
}

async function searchDealers(term, manufactureOptions) {
    const response = await api.get('/dealer/search', { params: { term } });
    const dealers = Array.isArray(response.data) ? response.data : [];

    return dealers.map((dealer) => mapDealer(dealer, manufactureOptions));
}

async function filterDealers(filters, manufactureOptions) {
    const response = await api.get('/dealer/filter', { params: cleanFilters(filters) });
    const dealers = Array.isArray(response.data) ? response.data : [];

    return dealers.map((dealer) => mapDealer(dealer, manufactureOptions));
}

async function createDealer(values, manufactureOptions) {
    const response = await api.post('/dealer', {
        city: values.city,
        country: values.country,
        manufacture_id: Number(values.manufacture_id),
        employees_count: Number(values.employees_count || 0),
    });

    return mapDealer(response.data, manufactureOptions);
}

async function updateDealer(values, manufactureOptions) {
    await api.put('/dealer', {
        dealer_id: values.id,
        data: {
            city: values.city,
            country: values.country,
            manufacture_id: Number(values.manufacture_id),
            employees_count: Number(values.employees_count || 0),
        },
    });

    return mapFormDealer(values, manufactureOptions);
}

async function deleteDealer(row) {
    await api.delete('/dealer', {
        data: {
            dealer_id: row.id,
        },
    });
}

function createDealerActions(manufactureOptions) {
    return {
        list: () => listDealers(manufactureOptions),
        search: (term) => searchDealers(term, manufactureOptions),
        filter: (filters) => filterDealers(filters, manufactureOptions),
        create: (values) => createDealer(values, manufactureOptions),
        update: (values) => updateDealer(values, manufactureOptions),
        delete: deleteDealer,
    };
}

export default function Dealers() {
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [fields, setFields] = useState([]);
    const [filterFields, setFilterFields] = useState([]);
    const [manufactureOptions, setManufactureOptions] = useState([]);

    useEffect(() => {
        Promise.all([
            api.get('/dealer'),
            api.get('/manufacture'),
        ])
            .then(([dealersResponse, manufacturesResponse]) => {
                const manufactures = Array.isArray(manufacturesResponse.data) ? manufacturesResponse.data : [];
                const nextManufactureOptions = mapManufactureOptions(manufactures);
                const nextFields = buildDealerFields(nextManufactureOptions);
                const dealers = Array.isArray(dealersResponse.data) ? dealersResponse.data : [];

                setManufactureOptions(nextManufactureOptions);
                setRows(dealers.map((dealer) => mapDealer(dealer, nextManufactureOptions)));
                setFields(nextFields);
                setFilterFields(nextFields);
                setReady(true);
            })
            .catch(() => setError('Could not load dealers'));
    }, []);

    if (error) {
        return <p className="empty-cell">{error}</p>;
    }

    if (!ready) {
        return <p className="empty-cell">Loading…</p>;
    }

    const actions = createDealerActions(manufactureOptions);

    return (
        <ResourceTable
            title="All dealers"
            columns={dealerColumns}
            fields={fields}
            filterFields={filterFields}
            initialRows={rows}
            actions={actions}
        />
    );
}
