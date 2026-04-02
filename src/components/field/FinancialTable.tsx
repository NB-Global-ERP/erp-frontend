import {Grid, Toolbar, Willow} from "@svar-ui/react-grid";
import "@svar-ui/react-grid/all.css";
import '@/styles/svar-theme.css';
import {useState, useMemo} from "react";
import {formatPercent} from "@/utils/formatters.ts";

const mockBudgetData = [
    { id: "1", costCenter: "IT-001", planned: 1500000, actual: 1250000, department: "IT", execution: 20 },
    { id: "2", costCenter: "IT-002", planned: 800000, actual: 450000, department: "IT", execution: 50 },
    { id: "3", costCenter: "HR-001", planned: 500000, actual: 320000, department: "HR", execution: 50 },
    { id: "4", costCenter: "HR-002", planned: 300000, actual: 180000, department: "HR", execution: 20 },
    { id: "5", costCenter: "FIN-001", planned: 1200000, actual: 1100000, department: "Finance", execution: 30 },
    { id: "6", costCenter: "FIN-002", planned: 600000, actual: 700000, department: "Finance", execution: 90 },
    { id: "7", costCenter: "SALES-001", planned: 2000000, actual: 1650000, department: "Sales", execution: 20 },
    { id: "8", costCenter: "SALES-002", planned: 1000000, actual: 890000, department: "Sales", execution: 5 },
    { id: "9", costCenter: "MKT-001", planned: 700000, actual: 680000, department: "Marketing", execution: 10 },
    { id: "10", costCenter: "MKT-002", planned: 400000, actual: 310000, department: "Marketing", execution: 30 },
];

export function FinancialTable() {
    const [api, setApi] = useState<any>(null);
    const [search, setSearch] = useState("");

    const toolbarItems = [
        {
            id: "add-row",
            comp: "button",
            icon: "wxi-plus",
            action: () => {
                console.log("Add row clicked");
            },
        },
        {
            id: "delete-row",
            comp: "button",
            icon: "wxi-delete",
            action: () => {
                console.log("Delete clicked");
            },
        },
        { comp: "spacer" },
        {
            id: "export",
            comp: "button",
            icon: "wxi-download",
            action: () => {
                console.log("Export clicked");
            },
        },
    ];

    const columns = [
        { id: "costCenter", header: "Центр затрат"},
        { id: "planned", header: "План, ₽"},
        { id: "actual", header: "Факт, ₽"},
        { id: "department", header: "Департамент"},
        {
            id: "execution",
            header: "Исполнение, %",
            format: formatPercent,
        },
    ];

    const filteredData = useMemo(() => {
        if (!search) return mockBudgetData;
        return mockBudgetData.filter(item =>
            item.costCenter.toLowerCase().includes(search.toLowerCase()) ||
            item.department.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <input
                    type="text"
                    placeholder="Поиск по центру затрат..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-96"
                />
            </div>

            <Toolbar api={api} items={toolbarItems} />

            <Willow>
                <div className="w-full h-full">
                    <Grid
                        data={filteredData}
                        columns={columns}
                        init={setApi}
                        multiselect reorder
                    />
                </div>
            </Willow>
        </div>
);
}