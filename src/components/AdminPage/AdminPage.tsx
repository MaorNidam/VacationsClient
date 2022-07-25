import { useSelector } from "react-redux";
import { AppState } from "../../redux/app-state";
import {
    Chart,
    BarSeries,
    ArgumentAxis,
    ValueAxis
} from '@devexpress/dx-react-chart-material-ui';

import "./admin-page.css"
import { ValueScale } from "@devexpress/dx-react-chart";
import { UserType } from "../../models/UserType";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface IDataItem {
    name: string,
    likes: number,
}

export default function AdminPage() {
    const navigate = useNavigate();
    const data: IDataItem[] = [];

    let currentUser = useSelector((state: AppState) => state.currentUser);
    let isAdmin = (currentUser.typeOfUser === UserType.Admin);

    useEffect(() => {
        if (!isAdmin) {
            alert("Unauthorized entry.");
            navigate("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    let vacationMap = useSelector((state: AppState) => state.vacationMap);

    vacationMap.forEach((vacation) => {
        data.push({ name: vacation.name, likes: vacation.amountOfLikes });
    });


    return (
        <div className="admin-page">
            <h1> Admin Page</h1>
            <div className="chart">
                <Chart
                    data={data}
                >
                    <ValueScale name="likes" />

                    <ArgumentAxis />
                    <ValueAxis scaleName="likes" showGrid={false} showLine={true} showTicks={true} />

                    <BarSeries
                        name="Vacation Name"
                        valueField="likes"
                        argumentField="name"
                        scaleName="likes"
                    />

                </Chart>
            </div>
        </div>
    );
}