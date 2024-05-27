import { useEffect, useState } from 'react';
import {TripData} from "../types.ts";
import data from "../assets/data.json";

export default function DataTable() {
  const [trips, setTrips] = useState<TripData[]>([]);

  useEffect(() => {
    const tripData: TripData[] = [];
    data.forEach((trip) => {
      tripData.push({
        From: trip.From,
        To: trip.To,
        Date: trip.Date,
        Departure: trip.Departure,
        Arrival: trip.Arrival,
        Duration: trip.Duration,
        'Base price': parseFloat(trip['Base price'].replace(' zł', '').replace(',', '.')),
        Discount: parseFloat(`${trip.Discount}`.replace(',', '.')),
        Price: parseFloat(trip.Price.replace(' zł', '').replace(',', '.')),
      });
    });

    setTrips(tripData);
    console.log(tripData)
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>From</th>
          <th>To</th>
          <th>Date</th>
          <th>Departure</th>
          <th>Arrival</th>
          <th>Duration</th>
          <th>Base price</th>
          <th>Discount</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {trips.map((trip, index) => (
          <tr key={index}>
            <td>{trip.From}</td>
            <td>{trip.To}</td>
            <td>{trip.Date}</td>
            <td>{trip.Departure}</td>
            <td>{trip.Arrival}</td>
            <td>{trip.Duration}</td>
            <td>{trip['Base price']}</td>
            <td>{trip.Discount}</td>
            <td>{trip.Price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}