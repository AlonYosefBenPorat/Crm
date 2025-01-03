import axios from 'axios';

interface EmailData {
  toEmail: string;
  subject: string;
  message: string;
}

export const sendEmail = async (emailData: EmailData) => {
  const data = JSON.stringify({
    "ToEmail": emailData.toEmail,
    "Subject": emailData.subject,
    "Message": emailData.message
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://localhost:7003/api/email/send',
    headers: { 
      'Content-Type': 'application/json', 
      'Cookie': '.AspNetCore.Identity.Application=CfDJ8F0h3GD5IKlBpbBQGPLNfT3uL-4SWXxBLO36vmXKEFVbbmk9iKEw9MdqFKWyWxM51YTM1yT2loRZFBTsMmiVUUl4sAFDTHThL5NzpAGnpr4kAuKHeKGIou8G0G9fiMdebxBr7f0p7TB7PxU-IzA-47qQC6I7xelX8KHQu6Khl0duNKYz57zODG_2DVLwg5retvOrTLk-RDvPrC523nETUAwoTH8YOZt_nHuwRu52dEJz3PZafZH2BRPuDYyQisPC0AUjRN8V2xBjl9wmQH45vQeIkyY0PMekjOlfoqU9N9hoHCdG5qIVJ5DQsSl4Z8NIqrgiJm-hVMLcwRVXbl2g4s_gJ5eUojmBF4xSh0Xd_CNMKCHYWQNqOQ09SLApgs3V5pnj_KzKtQryjDY4SgsATPXhG9tekIm9BQRXnmq0wVF0gZUw1NSaH0PZpoHSl0rEo7k90SU9ssOEKFHcKhL0oLU8l2CQ3tvhgvNwae2yZS7FMNIpWE7sIvO7rZFbU82kQbDgrkOOhR6BunkHj_k5yNm3autOVkp6ZdOaAiuPTbvk5wgMANpa713YoSM1oH37sTbUBgjXfGkI9Smf30wJmt_uokDTmIBrtIJFkR_TNMzlyLqu1ERI4_PIKu_aPhYH9x5T3xyC0ef7co9UbPvl4DQIedBvzuXkqRB5dtpoLTBTrOQ9eMiglcNH2M2xPOECw_nkU9epRBKyI3CXMW2_l-Lz8MOWqSrH7FhoPK2dPCmEKFK02fp1_MUk3SKaF_ZxujBHkxthdZ9TpzdKM4czobtWvB4Hdyqhb7emseGO9EsUrcDXlj0mRAWXHvJwIgu6EdExMOJasStJRtizykOFevI'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};