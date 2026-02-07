export interface SpecialRequestInfo {
    completed: boolean;
    enabled: boolean;
    quantity?: number;
    select?: number;
    description: string;
    // Optional fields for specific special requests (e.g. Paw Print Clay)
    disc?: number;
    urn?: number;
}

export interface SpecialRequestDateInfo {

    enabled: boolean;
    datetime: Date;
    description: string;
}

export interface FormData {
    name: string;
    owner: string;
    breed: string;
    type: string;
    gender: string;
    weight: number;
    age: number;
    dateOfDeath: string;
    hasProstheses: boolean;
    prosthesesDetails: string;
    ownerAddress: string;
    ownerCity: string;
    ownerPostalCode: string;
    ownerPhone: string;
    ownerEmail: string;
    pickupMethod: string;
    // legacy or aggregated whatsapp options (not used by the current form)
    wantsWhatsappUpdates?: string[];
    whatsappStart: boolean;
    whatsappFinish: boolean;
    price: number;
    veterinaryName: string;
    clientNotes: string;
    cremationType: string;
    specialRequestPawPrintInk: SpecialRequestInfo;
    specialRequestPawPrintClay: SpecialRequestInfo;
    specialRequestHairPluck: SpecialRequestInfo;
    specialRequestNoseImprint: SpecialRequestInfo;
    specialRequestOther: SpecialRequestInfo;
    lastViewing: SpecialRequestDateInfo;
    following: SpecialRequestDateInfo;
    cremationDate: Date;
    urnOrder: boolean;
    urnSupplier: string;
    urnDetails: string;
    jewelryOrder: boolean;
    jewelrySupplier: string;
    jewelryDetails: string;
    others: boolean;
    othersDetails: string;
    pickupDateTime: string;
    isSundayOrFestival: boolean;
    pickupEveningTime: string;
    notificationSent: boolean;


}
export interface Stats {
    daily: any;
    Total: number;
    Individual: number;
    Collective: number;
    Morning: number;
    Evening: number;
    Ceremonies: number;
    pets: Pet[];
    Week: { daily: Stats[] };
}

export enum PetStatus {
    WAITING = 'Waiting',
    REGISTERED = 'Registered',
    PICKED_UP = 'Picked up',
    IN_STORAGE = 'In storage',
    SCHEDULED_FOR_CREMATION = 'Scheduled for cremation',
    PERFORM_SPECIAL_ACTIVITIES = 'Perform special activities',
    READY_FOR_PICKUP_DELIVERY = 'Ready for pickup/delivery',
    CREMATION_STARTED = 'Cremation started',
    CREMATION_ENDED = 'Cremation ended',
    READY_FOR_SENDING = 'Ready for sending',
    COMPLETED = 'Completed',
}

export enum KanbanStage {
    INTAKE = 'Intake',
    PREPARATION = 'Preparation',
    CREMATION = 'Cremation',
    COMPLETION = 'Completion',
}

export enum ViewType {
    KANBAN = 'kanban',
    TABLE = 'table',
    CALENDAR = 'calendar',
    REPORTS = 'reports',
}

export enum PetType {
    DOG = 'Dog',
    CAT = 'Cat',
    OTHER = 'Other',
}

export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
}

export enum PickupMethod {
    BROUGHT_BY_OWNER = 'Brought by owner',
    PICKED_UP_AT_HOME = 'Picked up at home',
    PICKED_UP_AT_VET = 'Picked up at Veterinary',
}

export enum CremationType {
    INDIVIDUAL = 'Individual',
    COLLECTIVE = 'Collective',
}

export enum EveningPickupTime {
    AFTER_7_PM = 'After 7 PM',
    AFTER_8_PM = 'After 8 PM',
    AFTER_9_PM = 'After 9 PM',
    AFTER_10_PM = 'After 10 PM',
    AFTER_12_AM = 'After 12 AM',
}

export interface Comment {
    id: string;
    text: string;
    date: string;
    author: string; // To know who made the comment
    notifiedClient: boolean;
    previousStatus?: PetStatus;
    newStatus?: PetStatus;
}

export interface PreparationTask {
    quantity: number;
    description: string;
    status: 'Completed' | 'Not completed' | '-';
}

export interface PreparationData {
    greeting?: string;
    followCremation?: string;
    pawPrint: PreparationTask;
    pluckHair: PreparationTask;
    other: PreparationTask;
    urne: PreparationTask;
    juwelery: PreparationTask;
    readyForCremation: 'Yes' | 'No';
}


export interface SpecialRequestDateInfo {
    enabled: boolean;
    datetime?: Date;
    description: string;
}

export interface Customer {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
    email: string;
    vat?: string;
}

export interface Pet {
    id: string;
    petNumber: number;
    tagNumber: string;
    name: string;
    date: Date;
    breed: string;
    receivedDate: string;
    status: PetStatus;

    // Pet Information
    type: PetType;
    gender: Gender;
    weight: number; // in kg
    age: number; // in years
    dateOfDeath: string;
    hasProstheses: boolean;
    prosthesesDetails: string;

    // Client Information
    // owner: string;
    // ownerAddress: string;
    // ownerCity: string;
    // ownerPostalCode: string;
    // ownerPhone: string;
    // ownerEmail: string;
    customer: Customer;

    pickupMethod: PickupMethod;
    wantsWhatsappUpdates: string[];
    price?: number;
    veterinaryName?: string;
    clientNotes?: string;
    whatsappStart?: boolean;
    whatsappFinish?: boolean;


    // Cremation Details
    cremationType: CremationType;
    cremationDate: string;
    specialRequestPawPrintInk: SpecialRequestInfo;
    specialRequestPawPrintClay: SpecialRequestInfo;
    specialRequestHairPluck: SpecialRequestInfo;
    specialRequestNoseImprint: SpecialRequestInfo;
    specialRequestOther: SpecialRequestInfo;
    ceremony: string;
    lastViewing: SpecialRequestDateInfo[];
    lastViewingEnabled: boolean;
    following: SpecialRequestDateInfo;

    urnOrJewelryOrder: boolean;
    urnOrder: boolean;
    urnSupplier: string;
    urnDetails: string;
    urnRequest: SpecialRequestInfo[];


    jewelry: SpecialRequestInfo;
    engraving: SpecialRequestInfo;
    others: SpecialRequestInfo;
    others2: SpecialRequestInfo;

    isOpenbaring: boolean;
    openbaringDetails?: string;

    // Pickup Details
    pickupDateTime: string;
    isSundayOrFestival: boolean;
    pickupEveningTime: EveningPickupTime | '';

    // Internal
    notificationSent?: boolean;
    notifications?: Notification[];
    comments: Comment[];
    notify?: {};

    // Preparation Room Data
    preparationData?: PreparationData;

    // Cremation Room Data
    chamber?: number;

    // table
    others_info?: string;

    preparationStatus?: 'Completed' | 'Yes' | 'No' | '';

    isPickupDate?: boolean;
}

export interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    type: 'pickup' | 'consultation' | 'memorial';
}
