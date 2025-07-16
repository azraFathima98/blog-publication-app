import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
export default function LoginPage(){
    const [email, setEmail]= useState('');
    const [password, setPassword]=useState('');
    const [isLogin,setIsLogin] = useState(true);
    const [message,setMessage]=useState('');
    const handleAuth=async()=>{
        if(!email || !password){
            setMessage("Email and password are required.");
            return;
        }
        setMessage("Loading..");
        if(isLogin){
            const{error}=await supabase.auth.signInWithPassword({email,password});
            console.log("Auth result (login):",error);
            if(error){
                setMessage("Login failed: "+error.message);
            
            }else{
                setMessage("Login successful");
            }
            }else{
                const{error}=await supabase.auth.signUp({email,password});
                console.log("Auth result(register):",error);
                if(error){
                    setMessage("Signup failed: "+ error.message);
                }else{
                    setMessage("Signup successful check your email");
                }
            }
         };
         return(
            <div style={{maxWidth: "400px",margin:"auto",paddingTop:"50px"}}>
                <h2>{isLogin ? "Login" : "Register"}</h2>
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{width: "100%", marginBottom: "10px",padding:"8px"}}
                />
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e =>setPassword(e.target.value)}
                style={{width:"100%",marginBottom: "10px",padding:"8px"}}
                />
                <button onClick={handleAuth} style={{width:"100%",padding:"10px",marginBottom:"10px"}}>
                    {isLogin ? "Login" : "Register"}
                </button>
               <button onClick={()=> setIsLogin(!isLogin)} style={{width:"100%", padding: "10px"}}>
                Switch to {isLogin ? "Register" : "Login"}
               </button>
               <p style={{marginTop: "20px", color:"green"}}>{message}</p>
               </div>
         );
        } 


        
    
