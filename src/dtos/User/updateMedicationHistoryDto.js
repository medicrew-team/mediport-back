class updateMedicationHistoryDto {
    constructor(medi_name,start_date,end_date,status,dosage) {
        this.medi_name = medi_name;
        this.start_date = start_date;
        this.end_date = end_date;
        this.status = status;
        this.dosage = dosage;
}
}

module.exports = updateMedicationHistoryDto;