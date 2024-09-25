import { db } from '../../../models/index.js';
import JWT from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import config from '../../../config/app.js';
import bcrypt from 'bcrypt-nodejs';
import speakeasy from 'speakeasy';
import { validateEmail } from './../../../functions.js'
import util from 'util';



var JWTSign = function (user, date) {
    return JWT.sign({
        iss: config.name,
        sub: user.id,
        iam : user.type,
        iat: date.getTime(),
        exp: new Date().setMinutes(date.getMinutes() + 480)
    }, config.secret);
}

function generateOtp() {
    let token = speakeasy.totp({
        secret: process.env.OTP_KEY,
        encoding: 'base32',
        step: (30 - Math.floor((new Date().getTime() / 1000.0 % 30)))
    });
    return token;
}

function verifyOtp(token) {
    let expiry = speakeasy.totp.verify({
        secret: process.env.OTP_KEY,
        encoding: 'base32',
        token: token,
        step: (30 - Math.floor((new Date().getTime() / 1000.0 % 30))),
        window: 0
    });
    return expiry
}


export default {
    async addUser(req, res, next) {
        const { firstName, email,verify, role ,password} = req.body;
        var passwordHash = bcrypt.hashSync(password);
        var token = generateOtp();
        var otp = verifyOtp(token);
        db.user.findOne({ where: { email: email }, paranoid: false })
            .then(find => {
                if (find) {
                    throw new RequestError('Email is already in use', 409);
                }
                return db.user.create({
                    firstName: firstName,                    
                    email: email,                             
                    verify: verify,
                    role: role,
                    password: passwordHash
                })

            })
            .then(user => {
                if (user) {
//                     mailer.sendEmployeePassword(email, token);
                    return res.status(200).json({ success: true, key: otp, msg: "New Registration added and password has been sent to " + email + " ." });
                }
                else
                    res.status(500).json({ 'success': false });
            })
            .catch(err => {
                console.log(err)
                next(err);
            })
    },

    async findUser(req,res,next){
        db.user.findOne({ attributes:["firstName"], where: { email: req.query.email }, paranoid: false })
        .then(user => {
            if (user) {
                return res.status(200).json({ success: true, data:user});
            }
            else
                res.status(500).json({ 'success': false });
        })
        .catch(err => {
            console.log(err)
            next(err);
        })
    },

     async getAllUserList(req,res,next){
        db.user.findAll({          
        })
        .then(user => {
            if (user) {
                return res.status(200).json({ success: true, data:user});
            }
            else
                res.status(500).json({ 'success': false });
        })
        .catch(err => {
            console.log(err)
            next(err);
        })
    },

     async userUpdate(req,res,next){
        const { id, firstName, email, verify, role ,password } = req.body;
        if (password !== null) {
          var passwordHash = bcrypt.hashSync(password);
        }    
        db.user.findOne({ where: { id: id }, paranoid: false })
            .then(user => {
                if (!user) {
                    throw new RequestError('User is not found', 409);
                }
                return db.user.update({
                    firstName: firstName ? firstName: user.firstName,
                    email: email ? email: user.email,
                    password: password ? passwordHash: user.passwordHash,              
                    role: role ? role: user.role,
                    verify : verify? verify: user.verify                    
                }, { where: { id: id } })
            })
            .then(user => {
                if (user) {
                    return res.status(200).json({ success: true, msg: "User update successsfully"});
                }
                else
                    res.status(500).json({ 'success': false });
            })
            .catch(err => {
                console.log(err)
                next(err);
            })
    },

    async login(req, res, next) {
        var date = new Date();
        var token = JWTSign(req.user, date,{expiresIn: '12h'});
        res.cookie('XSRF-token',token, {
            expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
            httpOnly: true, secure: config.secure
        });
        
        return res.status(200).json({ success: true ,token,role: req.user.role,firstName: req.user.firstName,id_lider: req.user.id});
    },

     async deleteUserList(req, res, next) {
        db.user.findOne({ where: { id: req.body.id} })
            .then(data => {
                if (data) {
                    return db.user.destroy({ where: { id: req.body.id } }).then(r => [r, data])
                }
                throw new RequestError('User is not found', 409)
            })
            .then(re => {
                return res.status(200).json({ 'status': "deleted userlist Seccessfully" });
            }).catch(err => {
                next(err)
            })
    },

   async forgotpassword(req,res,next) {
      const { email } = req.body;  
      const user = await db.user.findOne({ where: { email: email} })
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }    
      // Gerar o token de redefinição de senha
      const token = JWT.sign({ email }, process.env.OTP_KEY, { expiresIn: '1h' });
    
      // Enviar e-mail com o link de redefinição de senha
      //sendPasswordResetEmail(email, token);    
       const transporter = nodemailer.createTransport({
          // Configurações do seu serviço de e-mail
           host: 'smtp.gmail.com',
           port: '587',
          auth: {
            user: 'prjalvo@gmail.com',
            pass: 'cmsdrbftcrqbvuwn'
          },
            tls: {rejectUnauthorized: false},
      });

      const resetLink = 'https://ibaredeverde.app.br/reset-password?token=' + token
    
      const mailOptions = {
                from: 'prjalvo@gmail.com',
                to: email,
                subject: 'Redefinição de Senha',
                text: 'Para redefinir sua senha, clique neste link: ' + resetLink
       };
    
      transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
              res.json({ message: error } );
       } else {
               res.json({ message: 'Token de redefinição de senha enviado por e-mail: ' + email });
      }
     });  
     
  },    
  async resetpassword(req,res,next) {
            const { token, password } = req.body;   
            const verifyAsync = util.promisify(JWT.verify);              
            // Verificar se o token é válido
            try {  
                    const decoded = await verifyAsync(token,process.env.OTP_KEY); 
                      // Hash da nova senha
                    const hashedPassword = bcrypt.hashSync(password);         
                    // Verificar se o email do token está associado a uma conta existente
                    const user = await db.user.findOne({ where: { email: decoded.email } } );
                    if (!user) {
                        return res.status(404).json({ error: 'Usuário não encontrado' });
                    } 
                    else
                    {
                        db.user.update(
                        { password: hashedPassword ? hashedPassword : user.password },
                        { where: { email: decoded.email } }
                        );
                
                      // Retornar uma resposta de sucesso
                      return res.status(200).json({ message: 'Senha atualizada com sucesso' });
                    }
              } catch (error) {
                  // Erro ao verificar o token
                  if (error.name === 'TokenExpiredError') {
                      // O token expirou
                     return res.status(200).json( { message: 'O token expirou.' } );
                  } else if (error.name === 'JsonWebTokenError') {
                    // O token é inválido ou malformado
                    return res.status(200).json( { message: 'O token é inválido ou malformado.' } );
                  } else {
                    // Outro tipo de erro
                    return res.status(500).json( { message: 'Ocorreu um erro ao verificar o token: ' + error.message } );
                  }
            }            
   },

}




