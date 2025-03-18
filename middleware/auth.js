import jwt from 'jsonwebtoken';
const auth=(req,res,next)=>{
const token=req.cookies.token

if(!token){
    return res.status(403).send('Login first') 

} 
try{
  console.log('token is',token);
const decode=jwt.verify(token,process.env.JWT_SECRET)
console.log(decode)
req.user=decode
}
catch(err){
  console.log(err);
  return res.status(401).send('Invalid Token')}
return next()
} 
export default auth;