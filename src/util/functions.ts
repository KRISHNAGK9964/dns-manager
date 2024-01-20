export const getAge = (createdAt:any) =>{
    console.log(createdAt);
    createdAt = new Date(createdAt);
    const seconds = createdAt.getSeconds();
    console.log(createdAt);
    
}