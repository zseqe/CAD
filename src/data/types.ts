export type DeptId='watches'|'clothing'|'bags'|'perfumes'
export interface Product{id:string;slug:string;brand:string;department:DeptId;subcategory:string;name:string;price:number;currency:string;images:string[];description:string;colors:string[];sizes:string[];material:string;gender?:string;featured?:boolean;newArrival?:boolean}
export interface Brand{id:string;name:string;logo:string;heroImage:string;description:string;featured?:boolean}
export interface Department{id:DeptId;name:string;slug:string;image:string;tagline:string;blurb:string;subcategories:{id:string;name:string}[]}
