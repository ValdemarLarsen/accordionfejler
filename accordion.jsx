"use client"
import React from 'react';
import { useEffect, useState } from "react";
import { Disclosure } from '@headlessui/react';
import { InputNumber } from 'antd';
import { Button } from 'antd';
import { Collapse } from 'antd';
const { Panel } = Collapse;

export default function Opretsag({ sigtelser }) {
    const [categorizedSigtelser, setCategorizedSigtelser] = useState({
        'Færdselsloven': [],
        'Straffeloven': [],
        'Bek. euf. stoffer': [],
        'Våbenloven': [],
        'Ordensbekendtgørelsen': [],
    });

    useEffect(() => {
        const newCategorizedSigtelser = {
            'Færdselsloven': [],
            'Straffeloven': [],
            'Bek. euf. stoffer': [],
            'Våbenloven': [],
            'Ordensbekendtgørelsen': [],
        };

        // Assuming sigtelser is an array of objects
        sigtelser.forEach((sigtelse) => {
            if (newCategorizedSigtelser[sigtelse.law]) {
                newCategorizedSigtelser[sigtelse.law].push(sigtelse);
            } else {
                // If the law doesn't match any predefined categories,
                // you could add it to a 'miscellaneous' array, or just ignore it.
            }
        });
        console.log(sigtelser);
        setCategorizedSigtelser(newCategorizedSigtelser);
    }, [sigtelser]); // This will re-run when sigtelser updates


    // holder styr på valgte rows.
    const [selectedRows, setSelectedRows] = useState([]);





    const Accordion = ({ title }) => {
        const [isOpen, setIsOpen] = useState(false);

        const offensesForLaw = categorizedSigtelser[title] || []; // Get the offenses for this law, or an empty array if none

        return (
            <Disclosure open={isOpen} onChange={() => setIsOpen(!isOpen)} as="div" className="mb-8">
                {({ open }) => (
                    <>
                        <Disclosure.Button className="flex justify-between w-full px-4 py-4 text-sm font-medium text-left dark:text-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                            {title}
                            {open ? (
                                <svg className="inline-block w-5 h-5 text-white hover:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M4.75 9.75a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5h-10.5z" />
                                </svg>
                            ) : (
                                <svg className="inline-block w-5 h-5 text-white hover:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                </svg>
                            )}
                        </Disclosure.Button>
                        <Disclosure.Panel onClick={(e) => e.stopPropagation()} className="px-4 pt-4 pb-2 text-sm text-gray-700 dark:text-gray-200">
                            {offensesForLaw.length > 0 ? (
                                generateTableForLaw(offensesForLaw, title)
                            ) : (
                                <p>Der skete en fejl eller så findes der ikke nogle sigtelser her..</p>
                            )}
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        );
    };

    const generateTableForLaw = (offenses, law) => {
        if (!offenses || offenses.length === 0) return null;

        // Function to safely parse the JSON string in the 'cols' field
        const parseCols = (cols) => {
            try {
                return JSON.parse(cols);
            } catch (e) {
                console.error('Error parsing JSON:', e);
                return {}; // Return an empty object if parsing fails
            }
        };

        const booleanToJaNej = (value) => {
            if (typeof value === 'boolean') {
                return value ? 'Ja' : 'Nej';
            }
            return value;
        };


        // Dynamically determine the columns for the first offense as a sample
        const sampleCols = parseCols(offenses[0].cols);
        const columns = Object.keys(sampleCols);
        const handleButtonClick = (event, offense) => {
            event.stopPropagation();

            // Prevent any default action if necessary
            event.preventDefault();
        
            setSelectedRows(prevSelectedRows => {
                if (prevSelectedRows.includes(offense.id)) {
                    // If the row is already selected, deselect it
                    return prevSelectedRows.filter(id => id !== offense.id);
                } else {
                    // Otherwise, add it to the selected rows
                    return [...prevSelectedRows, offense.id];
                }
            });
        };


        const onChange = (value, offense) => {
            console.log('Value changed for offense ID:', offense.id, 'New Value:', value);
            // Handle the new value for the specific offense here
        };


        return (
            <div className="my-6" key={law}>
                <h2 className="text-xl font-bold mb-3">{law}</h2>
                <div className="border border-gray-200 rounded overflow-x-auto min-w-full bg-white dark:bg-gray-800 dark:border-gray-700">
                    <table className="min-w-full text-sm align-middle whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-700/50">
                                {/* Static headers */}
                                <th className="px-3 py-4 text-gray-900 bg-gray-100/75 font-semibold text-center dark:text-gray-50 dark:bg-gray-700/25">§</th>
                                <th className="px-3 py-4 text-gray-900 bg-gray-100/75 font-semibold text-left dark:text-gray-50 dark:bg-gray-700/25">Beskrivelse</th>
                                {/* Dynamic headers */}
                                {columns.map(column => (
                                    <th key={column} className="px-3 py-4 text-gray-900 bg-gray-100/75 font-semibold text-left dark:text-gray-50 dark:bg-gray-700/25">{column}</th>
                                ))}
                                <th className="px-3 py-4 text-gray-900 bg-gray-100/75 font-semibold text-left dark:text-gray-50 dark:bg-gray-700/25"></th>

                            </tr>
                        </thead>
                        <tbody>
                            {offenses.map(offense => {
                                const colsData = parseCols(offense.cols);
                                const isSelected = selectedRows.includes(offense.id);
                                return (
                                    <tr className="border-b border-gray-100 dark:border-gray-700/50" key={offense.id}>
                                        <td className="p-3 text-center">{offense.paragraph}</td>
                                        <td className="p-3">{offense.title}</td>
                                        {/* Dynamic data cells */}
                                        {columns.map(column => (
                                            <td key={`${offense.id}-${column}`} className="p-3">
                                                {booleanToJaNej(colsData[column])} {/* Apply the function here */}
                                            </td>
                                        ))}
                                        {/* Button cell */}
                                        <td className="p-3 text-right">
                                            {isSelected ? (
                                                // InputNumber if the row is selected
                                                <InputNumber
                                                    min={1}
                                                    max={10}
                                                    defaultValue={1}
                                                    onChange={(value) => onChange(value, offense)}
                                                    className="w-full"
                                                />
                                            ) : (
                                                // Button if the row is not selected
                                                <Button
                                                onMouseDown={(e) => handleButtonClick(e, offense)}
                                                >
                                                    Tilføj
                                                </Button>

                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                </div>
            </div>
        );
    };



    return (
        <>
            <div className="container xl:max-w-12xl mx-auto p-4 lg:p-2 h-5/6">
                <div className="flex rounded-xl bg-gray-50 border-2 border border-gray-200 h-5/6 text-gray-400 py-6 dark:bg-gray-800 dark:border-gray-700">
                    <div className="container mx-auto p-8">
                        <Accordion title="Færdselsloven" />
                        <Accordion title="Straffeloven" />
                        <Accordion title="Bek. euf. stoffer" />
                        <Accordion title="Våbenloven" />
                        <Accordion title="Ordensbekendtgørelsen" />
                    </div>
                </div>
            </div>
        </>
    );
}
