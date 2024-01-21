export const getAge = (createdAt:any) =>{
    console.log(createdAt);
    createdAt = new Date(createdAt);
    const seconds = createdAt.getSeconds();
    console.log(createdAt);
    
}

export type domainType = {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };