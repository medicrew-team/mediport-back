class MedicationHistoryResponseDto {
    constructor(historyRecord) {
        this.history_id = historyRecord.history_id;
        this.user_id = historyRecord.user_id;
        this.kr_medi_id = historyRecord.kr_medi_id;
        this.custom_name = historyRecord.custom_name;
        this.start_date = historyRecord.start_date;
        this.end_date = historyRecord.end_date;
        this.status = historyRecord.status;
        this.dosage = historyRecord.dosage;

        // Conditional fields from KrMedi
        if (historyRecord.KrMedi) {
            this.prod_name = historyRecord.KrMedi.prod_name;
            this.prod_img = historyRecord.KrMedi.prod_img;
            // Add other relevant fields from KrMedi if needed
            this.medi_form = historyRecord.KrMedi.medi_form;
            this.medi_volume = historyRecord.KrMedi.medi_volume;
            this.category = historyRecord.KrMedi.category;
            this.bit = historyRecord.KrMedi.bit;
            this.atc_code = historyRecord.KrMedi.atc_code;
            this.ing_name = historyRecord.KrMedi.ing_name;
            this.prod_code = historyRecord.KrMedi.prod_code;
            this.ing_code = historyRecord.KrMedi.ing_code;
            this.purchase_loc = historyRecord.KrMedi.purchase_loc;
            this.icd = historyRecord.KrMedi.icd;
            this.icd_sum = historyRecord.KrMedi.icd_sum;
            this.kr_medi_dosage = historyRecord.KrMedi.dosage; // Renamed to avoid conflict
            this.contraindicated = historyRecord.KrMedi.contraindicated;
            this.storage_method = historyRecord.KrMedi.storage_method;
            this.daily_interaction = historyRecord.KrMedi.daily_interaction;
            this.drug_interaction = historyRecord.KrMedi.drug_interaction;
            this.adverse_reaction = historyRecord.KrMedi.adverse_reaction;

        } else {
            this.prod_name = historyRecord.custom_name; // Use custom_name as the primary name
            this.prod_img = null; // No image for custom meds
            // Set other KrMedi specific fields to null or default if they are part of the DTO
            this.medi_form = null;
            this.medi_volume = null;
            this.category = null;
            this.bit = null;
            this.atc_code = null;
            this.ing_name = null;
            this.prod_code = null;
            this.ing_code = null;
            this.purchase_loc = null;
            this.icd = null;
            this.icd_sum = null;
            this.kr_medi_dosage = null;
            this.contraindicated = null;
            this.storage_method = null;
            this.daily_interaction = null;
            this.drug_interaction = null;
            this.adverse_reaction = null;
        }
    }
}

module.exports = MedicationHistoryResponseDto;