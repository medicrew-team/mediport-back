class updateMedicationHistoryDto {
    constructor(medi_name,start_name,end_name,status,dosage) {
        this.medi_name = medi_name;
        this.start_name = start_name;
        this.end_name = end_name;
        this.status = status;
        this.dosage = dosage;
}
}

module.exports = updateMedicationHistoryDto;