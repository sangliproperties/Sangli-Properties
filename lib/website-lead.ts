export type WebsiteLeadPayload = {
    customerName: string;
    mobileNo: string;
    requirementMessage?: string;
    propertyId?: string | number;
    propertyName?: string;
    propertyCodeNo?: string;
    propertyLocation?: string;
    propertyPrice?: string | number;
    propertyType?: string;
    transactionType?: string;
};