export interface User {
    id?: number;
    avatar?: string;
    name: string;
    email: string;

}

export interface Address {
    id?: number;
    type: 'permanent' | 'communication';
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
}

export interface Experience {
    id?: number;
    company: string;
    title: string;
    start_date: string;
    end_date: string;
}

export interface Education {
    id?: number;
    university_name: string;
    degree: string;
    start_date: string;
    end_date: string;
}

export interface Resume {
    id: number;
    title: string;
    file_path: string;
    file?: File;
}

export interface Candidate {
    [key: string]: any; // Index signature for FormDataType compatibility
    user: User;
    resumes: Resume[];
    phone: string;
    linkedin: string;
    github: string;
    portfolio_url: string;
    experiences: Experience[];
    educations: Education[];
    skills: string;
    addresses: Address[];
    avatar: string;
    resumes: Resume[];
}
