// 쿼리문 정의
const getBoardById = `
  SELECT * 
  FROM Board 
  WHERE board_id = :boardId 
    AND category = :category 
  ORDER BY created_at ASC
`;

const parseImage = `
  SELECT distinct km.prod_name,
         km.medi_form,
         km.icd_sum,
         km.purchase_loc,
         km.dosage,
         km.prod_img,
	       km.bit,
         km.contraindicated,
         km.storage_method,
         km.daily_interaction,
         km.drug_interaction,
         km.adverse_reaction
  FROM kr_medi km
  JOIN international_medi im 
    ON km.prod_name COLLATE utf8mb4_general_ci 
       = im.matching COLLATE utf8mb4_general_ci
     OR km.prod_name COLLATE utf8mb4_general_ci 
       = im.realsame COLLATE utf8mb4_general_ci
  WHERE im.prod_name = :ocr COLLATE utf8mb4_general_ci;
`;
//contraindicated부터 상세페이지

const parseText = `
    SELECT distinct km.prod_name,
         km.medi_form,
         km.icd_sum,
         km.purchase_loc,
         km.dosage,
         km.prod_img,
	       km.bit,
         km.contraindicated,
         km.storage_method,
         km.daily_interaction,
         km.drug_interaction,
         km.adverse_reaction
  FROM kr_medi km
  JOIN international_medi im 
    ON km.prod_name COLLATE utf8mb4_general_ci 
       = im.matching COLLATE utf8mb4_general_ci
     OR km.prod_name COLLATE utf8mb4_general_ci 
       = im.realsame COLLATE utf8mb4_general_ci
  WHERE im.prod_name = :text COLLATE utf8mb4_general_ci;
`;
//contraindicated부터 상세페이지

const parseKrImage = `
  SELECT prod_name,
         medi_form,
         icd_sum,
         purchase_loc,
         dosage,
         prod_img,
         bit, 
         contraindicated, 
         storage_method,
         daily_interaction,
         drug_interaction,
         adverse_reaction
  FROM kr_medi
  WHERE prod_name COLLATE utf8mb4_general_ci IN (?);
`;
//contraindicated부터 상세페이지

const getLang = `
  SELECT language 
  FROM \`user\`
  WHERE user_id COLLATE utf8mb4_general_ci IN (?);
`;

const historyUser = `
  INSERT INTO chat_history (user_id, sender, message, created_at)
  VALUES ( ?, ?, ?, NOW());
`;

const historyBot = `
  INSERT INTO chat_history (user_id, sender, message, created_at)
  VALUES ( ?, ?, ?, NOW());
`;

const showHistory =`
  SELECT *
  FROM (
  SELECT sender, message, created_at, id
  FROM chat_history
  WHERE user_id = ?
  ORDER BY created_at DESC, id DESC
  LIMIT 10
  ) AS recent_history
  ORDER BY created_at ASC, id ASC;
`;

// CommonJS 방식으로 내보내기
module.exports = {
  getBoardById,
  parseImage,
  parseText,
  parseKrImage,
  getLang,
  historyUser,
  historyBot,
  showHistory,
};
