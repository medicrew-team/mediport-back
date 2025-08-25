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
         km.prod_img
  FROM kr_medi km
  JOIN international_medi im 
    ON km.prod_name COLLATE utf8mb4_general_ci 
       = im.matching COLLATE utf8mb4_general_ci
     OR km.prod_name COLLATE utf8mb4_general_ci 
       = im.realsame COLLATE utf8mb4_general_ci
  WHERE im.prod_name = :ocr COLLATE utf8mb4_general_ci;
`;

const parseText = `
  SELECT distinct km.prod_name,
         km.medi_form,
         km.icd_sum,
         km.purchase_loc,
         km.dosage,
         km.prod_img
  FROM kr_medi km
  JOIN international_medi im 
    ON km.prod_name COLLATE utf8mb4_general_ci 
       = im.matching COLLATE utf8mb4_general_ci
     OR km.prod_name COLLATE utf8mb4_general_ci 
       = im.realsame COLLATE utf8mb4_general_ci
  WHERE im.prod_name = :text COLLATE utf8mb4_general_ci;
`;


const parseKrImage = `
  SELECT prod_name,
         medi_form,
         icd_sum,
         purchase_loc,
         dosage,
         prod_img
  FROM kr_medi
  WHERE prod_name COLLATE utf8mb4_general_ci IN (?);
`;

const getLang = `
  SELECT language 
  FROM \`user\`
  WHERE user_id COLLATE utf8mb4_general_ci IN (?);
`

// CommonJS 방식으로 내보내기
module.exports = {
  getBoardById,
  parseImage,
  parseText,
  parseKrImage,
  getLang,
};
