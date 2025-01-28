export class Employee {
    name: string;
    role: string;
    fromDate: string | null;
    toDate: string | null;
    id: string;

    constructor() {
        this.name = "";
        this.role = "";
        this.fromDate = null;
        this.toDate = null;
        this.id = "";
    }
}
