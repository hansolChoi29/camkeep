import { createClient } from "@/lib/supabase/client"
import { NextResponse } from "next/server"


export async function POST(request: Request) {
    try {
        const { otp, newPassword } = await request.json()
        
        if (!otp || !newPassword) {
            return NextResponse.json({ error: ' OTP와 새비밀번호는 필수입니다. 다시 입력해 주세요.' }, {status:400})
        }

        const supabase = createClient()
        
        const { data: resetRequest, error: orpError } = await supabase
            .from('OTP')
            .select('user_id, expires_at, used')
            .eq('otp', otp)
            .single()
        if (orpError || !resetRequest) {
            return NextResponse.json({ error: '유효하지 않은 OTP입니다.' }, {status:404})
        }

        const { error: updateError } = await supabase.auth.admin.updateUserById(resetRequest.user_id, { password: newPassword })
        if (updateError) {
            return NextResponse.json({ error: '비밀번호 변경에 실패했습니다. 다시 시도해 주세요.' }, {status:500})
        }
        return NextResponse.json({ message: '비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.' } ,{status:200})
    } catch {
        return NextResponse.json({error:'서버 오류가 발생했습니다.'},{status:500})
    }
}