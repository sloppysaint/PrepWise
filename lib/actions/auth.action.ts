'use server'

import {auth, db} from "@/firebase/admin";
import {cookies} from "next/headers";
// import {auth} from "firebase-admin";

const ONE_WEEK = 60*60*24*7
export async function signUp(params: SignUpParams){
    const {uid, name, email} = params;

    try{
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return{
                success: false,
                message: 'User already exists!'
            }
        }
        await db.collection('users').doc(uid).set({
            email,
            name,
        })

        return {
            success: true,
            message: 'Account Created successfully. Please Sign in.'
        }

    }catch(err: any){
        console.error("Error creating a user with id ", err);

        if(err.code === 'auth/email-already-exists'){
            return{
                success: false,
                message: 'This email already exists',
            }
        }
        return {
            success: false,
            message: 'Failed to create a user with id ',
        }
    }
}

export async function signIn(params: SignInParams){
    const {email, idToken} = params;

    try{
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord){
            return {
                success: false,
                message: 'User does not exist. Create an account instead.'
            }
        }

        await setSessionCookie(idToken)
    }
    catch(err){
        console.log(err);

        return{
            success: false,
            message: 'Failed to login with id ',
        }
    }
}

export async function setSessionCookie(idToken: string){
    const cookieStore = await cookies()

    const sessionCookie = await auth.createSessionCookie(idToken,{
        expiresIn:ONE_WEEK *1000,
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,

        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

export async function getCurrentUser(): Promise<User| null>{
    const cookieStore = await cookies()

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await  auth.verifySessionCookie(sessionCookie,true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if(!userRecord.exists){
            return null;
        }

        return {
            ...userRecord.data(),
            id: userRecord.id
        } as User;
    }
    catch (e){
        console.error(e);
        return null;
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();

    return !!user;
}