export default function salonBooking(db) {
  /* ------------------ FIND FUNCTIONS ------------------ */
  async function findStylist(phoneNumber) {
    return await db.oneOrNone(
      "SELECT * FROM salon_schema.stylist WHERE phone_number=$1",
      [phoneNumber]
    );
  }
  async function findClient(phoneNumber) {
    return await db.oneOrNone(
      "SELECT * FROM salon_schema.client WHERE phone_number=$1",
      [phoneNumber]
    );
  }
  async function findTreatment(code) {
    return await db.oneOrNone(
      "SELECT * FROM salon_schema.treatment WHERE code=$1",
      [code]
    );
  }
  async function findAllTreatments() {
    return await db.any("TABLE salon_schema.treatment");
  }
  /* ------------------ FIND FUNCTIONS ------------------ */

  /* ------------------ FUNCTIONS RELATED TO APPOINTMENTS TABLE ------------------ */
  async function makeBooking(clientid, treatmentid, stylistid, date, time) {}
  async function findClientBookings(clientid) {}
  async function findStylistsForTreatment(treatmentid) {}
  async function findAllBookings({ date, time }) {}
  async function totalIncomeForDay(date) {}
  async function mostValuableClient(date) {}
  async function totalCommission(date, stylistid) {}
  return {
    findStylist,
    findClient,
    findTreatment,
    findAllTreatments,
    findAllBookings,
    findClientBookings,
    findStylistsForTreatment,
    makeBooking,
    totalIncomeForDay,
    mostValuableClient,
    totalCommission,
  };
}
