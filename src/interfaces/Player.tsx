export interface Player {
    PlayerId: number;
    FirstName: string;
    LastName: string;
    CommonName: string;
    MatchName: string;
    Position: string | null;
    Gender: string;
    BirthDate: string;
    BirthCity: string | null;
    BirthCountry: string | null;
    Nationality: string;
    Updated: string;
}