const express = require('express');
const app = express();
const path = require('path');

app.set("views",path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({limit:"10bm",extended:true}));




const axios = require('axios');
const YOUR_CLIENT_ID = ''
const YOUR_CLIENT_SECRET = ''
const YOUR_REDIRECT_URL = ''
//  how to get YOUR_CLIENT_ID,YOUR_CLIENT_SECRET
// 1.get https://console.cloud.google.com/projectselector2/apis/credentials/consent?supportedpurview=project
// 2.ด้านบนซาย select a project ให้กดแล้วทำการสร้างแอพที่มุมขวาบน ทำการใส่รายละเอียดแอพให้ครบ
// 3.เมนูด้านซ้ายเลือก Credentials แทบด้านบนเลือกเมนู Create Credentials  --> Create OAuth client ID --> เลือกเว็บแอพที่ต้องการ
// 4.หน้าสุดท้ายทำการกำหนด redirect utl ให้มาที่เว็บที่เราตั้งไว้ตาม YOUR_REDIRECT_URL ที่เมนู Authorized redirect URIs หลังจากนั้นจะได้ YOUR_CLIENT_ID,YOUR_CLIENT_SECRET
// 
app.get('/auth/google', (req, res) => {
	const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${YOUR_CLIENT_ID}&redirect_uri=${YOUR_REDIRECT_URL}&response_type=code&scope=profile email`;
	res.redirect(url);
});
app.get('/auth/google/callback', async (req, res) => {
	const { code } = req.query;
	try {
		const { data } = await axios.post('https://oauth2.googleapis.com/token', {
			client_id: YOUR_CLIENT_ID,
			client_secret: YOUR_CLIENT_SECRET,
			code,
			redirect_uri: YOUR_REDIRECT_URL,
			grant_type: 'authorization_code',
		});
		const { access_token, id_token } = data;
		const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
			headers: { Authorization: `Bearer ${access_token}` },
		});
    console.log(profile);
	  res.redirect('/');
	}catch{
	  res.redirect('/');
	}
});

app.get('/',(req, res)=>{
  res.render('auth.ejs');
});

const port = 3000;
app.listen(port , () => console.log('http://localhost:' + port));