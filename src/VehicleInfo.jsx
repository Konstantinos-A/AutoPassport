
import React, { useState } from "react";
import { ethers } from "ethers";
import AutoPassportABI from '../AutoPassport.json';
import { CONTRACT_ADDRESS } from '../config';

function VehicleInfo() {
    const [vin, setVin] = useState("");
    const [info, setInfo] = useState(null);

    const getVehicle = async () => {
        if (!vin) return;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, AutoPassportABI, provider);
        const data = await contract.getVehicle(vin);
        setInfo(data);
    };

    return (
        <div>
            <input type="text" placeholder="VIN" value={vin} onChange={e => setVin(e.target.value)} />
            <button onClick={getVehicle}>Ανάκτηση</button>
            {info && <pre>{JSON.stringify(info, null, 2)}</pre>}
        </div>
    );
}

export default VehicleInfo;
