const dotenv=require('dotenv');
dotenv.config();
const express=require('express');
const app=express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketio=require('socket.io');
const jwt=require("jsonwebtoken");




const User=require('./models/user');
const Message = require('./models/message');
const Forgotpassword = require('./models/password');
const Group = require('./models/group');
const Groupuser = require('./models/groupuser');




User.hasMany(Message);
Message.belongsTo(User);

Group.belongsToMany(User, {through: Groupuser});
User.belongsToMany(Group, {through: Groupuser});

Group.hasMany(Message);
Message.belongsTo(Group);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User)





const userroutes=require('./routes/user');
const passwordroutes=require('./routes/password');
const messageroutes=require('./routes/message');
const chatroutes=require('./routes/chat');
const adminroutes=require('./routes/admin');









const server=app.listen(4000,()=>{
    console.log('server started at port 4000');
});
const io=socketio(server,{
  cors:{
    origin:"*"
}});



io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  jwt.verify(token,process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return next(new Error('Invalid token'));
    }
  socket.userId = decoded.userId;
    next();
  });
});



io.on('connection', async(socket) => {
    socket.on('send-chat-message', async (data) => {
      console.log('hey buddy>>>>>>')
        const groupId=data.groupId;
        const message=data.message;
        const user=await User.findByPk(socket.userId);
        const messages=await user.createMessage({
            message: message,
                groupId: groupId,
                from: user.name
        })
         io.emit('send-chat-message',  messages)
         })
  });




app.use(bodyParser.json());
app.use(cors());



app.use('/user',userroutes);
app.use('/password',passwordroutes)
app.use('/message',messageroutes)
app.use('/chat',chatroutes)
app.use('/admin',adminroutes)




const sequelize=require('./util/database');
sequelize.sync();
