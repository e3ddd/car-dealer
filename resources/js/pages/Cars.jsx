import React, { useEffect, useState } from 'react';
import api from '../api';
import ResourceTable from '../components/ResourceTable';

const carColumns = [
    { key: 'size', label: 'Size' },
    { key: 'color', label: 'Color' },
    { key: 'fuel', label: 'Fuel' },
    { key: 'dealer', label: 'Dealer' },
    { key: 'manufacturer', label: 'Manufacturer' },
];

function toOptions(map) {
    return Object.entries(map ?? {}).map(([value, label]) => ({
        value: String(value),
        label: String(label),
    }));
}

function dealerMeta(dealerOptions, dealerId) {
    return dealerOptions.find((option) => String(option.value) === String(dealerId));
}

function mapCar(car, dealerOptions = []) {
    const dealer = dealerMeta(dealerOptions, car.dealer_id);

    return {
        id: car.id,
        size: String(car.size ?? ''),
        color: String(car.color ?? ''),
        fuel: String(car.fuel ?? ''),
        dealer_id: String(car.dealer_id ?? ''),
        dealer: car.dealer?.name ?? car.dealer?.city ?? dealer?.label ?? `#${car.dealer_id}`,
        manufacturer: car.dealer?.manufacture?.name ?? dealer?.manufacturer ?? '—',
    };
}

function mapFormCar(values, dealerOptions = []) {
    const dealer = dealerMeta(dealerOptions, values.dealer_id);

    return {
        id: values.id,
        size: String(values.size ?? ''),
        color: String(values.color ?? ''),
        fuel: String(values.fuel ?? ''),
        dealer_id: String(values.dealer_id ?? ''),
        dealer: dealer?.label ?? values.dealer ?? `#${values.dealer_id}`,
        manufacturer: dealer?.manufacturer ?? values.manufacturer ?? '—',
    };
}

function cleanFilters(filters) {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== undefined),
    );
}

function mapDealerOptions(dealers) {
    return dealers.map((dealer) => ({
        value: String(dealer.id),
        label: dealer.name ?? dealer.city ?? `#${dealer.id}`,
        manufacturer: dealer.manufacture?.name ?? '—',
    }));
}

function buildCarFields(sizeOptions, colorOptions, fuelOptions, dealerOptions) {
    return [
        { name: 'size', label: 'Size', options: sizeOptions },
        { name: 'color', label: 'Color', options: colorOptions },
        { name: 'fuel', label: 'Fuel', options: fuelOptions },
        { name: 'dealer_id', label: 'Dealer', options: dealerOptions },
    ];
}

async function listCars(dealerOptions) {
    const response = await api.get('/car');
    const cars = Array.isArray(response.data) ? response.data : [];

    return cars.map((car) => mapCar(car, dealerOptions));
}

async function searchCars(term, dealerOptions) {
    const response = await api.get('/car/search', { params: { term } });
    const cars = Array.isArray(response.data) ? response.data : [];

    return cars.map((car) => mapCar(car, dealerOptions));
}

async function filterCars(filters, dealerOptions) {
    const response = await api.get('/car/filter', { params: cleanFilters(filters) });
    const cars = Array.isArray(response.data) ? response.data : [];

    return cars.map((car) => mapCar(car, dealerOptions));
}

async function createCar(values, dealerOptions) {
    const response = await api.post('/car', {
        size: Number(values.size),
        color: Number(values.color),
        fuel: Number(values.fuel),
        dealer_id: Number(values.dealer_id),
    });

    return mapCar(response.data, dealerOptions);
}

async function updateCar(values, dealerOptions) {
    await api.put('/car', {
        car_id: values.id,
        data: {
            size: Number(values.size),
            color: Number(values.color),
            fuel: Number(values.fuel),
            dealer_id: Number(values.dealer_id),
        },
    });

    return mapFormCar(values, dealerOptions);
}

async function deleteCar(row) {
    await api.delete('/car', {
        data: {
            car_id: row.id,
        },
    });
}

function createCarActions(dealerOptions) {
    return {
        list: () => listCars(dealerOptions),
        search: (term) => searchCars(term, dealerOptions),
        filter: (filters) => filterCars(filters, dealerOptions),
        create: (values) => createCar(values, dealerOptions),
        update: (values) => updateCar(values, dealerOptions),
        delete: deleteCar,
    };
}

export default function Cars() {
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [fields, setFields] = useState([]);
    const [filterFields, setFilterFields] = useState([]);
    const [dealerOptions, setDealerOptions] = useState([]);

    useEffect(() => {
        Promise.all([
            api.get('/car'),
            api.get('/car/sizes'),
            api.get('/car/colors'),
            api.get('/car/types'),
            api.get('/dealer'),
        ])
            .then(([carsResponse, sizesResponse, colorsResponse, typesResponse, dealersResponse]) => {
                const nextDealerOptions = mapDealerOptions(Array.isArray(dealersResponse.data) ? dealersResponse.data : []);
                const sizeOptions = toOptions(sizesResponse.data);
                const colorOptions = toOptions(colorsResponse.data);
                const fuelOptions = toOptions(typesResponse.data);
                const nextFields = buildCarFields(sizeOptions, colorOptions, fuelOptions, nextDealerOptions);
                const cars = Array.isArray(carsResponse.data) ? carsResponse.data : [];

                setDealerOptions(nextDealerOptions);
                setRows(cars.map((car) => mapCar(car, nextDealerOptions)));
                setFields(nextFields);
                setFilterFields(nextFields);
                setReady(true);
            })
            .catch(() => setError('Could not load cars'));
    }, []);

    if (error) {
        return <p className="empty-cell">{error}</p>;
    }

    if (!ready) {
        return <p className="empty-cell">Loading…</p>;
    }

    const actions = createCarActions(dealerOptions);

    return (
        <ResourceTable
            title="All cars"
            columns={carColumns}
            fields={fields}
            filterFields={filterFields}
            initialRows={rows}
            actions={actions}
        />
    );
}
