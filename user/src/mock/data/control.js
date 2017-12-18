import Mock from 'mockjs';
const ControlList = [
    {
            totalPage:12,//共多少条数据
            deleteControl:false,
            tableData: [
                {
                    round:true,
                    subject: 'New training session 很长很长很长的主题名称很长很长的主题名称',
                    id: '123456',
                    password: '12345',
                    duration: '2016/09/30 04:00:00',
                },
                {
                    round:false,
                    subject: 'New training session',
                    id: '123456',
                    password: '123456',
                    duration: '2016/09/30 04:00:00',
                },
                {
                    round:false,
                    subject: 'New training session',
                    id: '123456',
                    password: '1234567',
                    duration: '2016/09/30 04:00:00',
                },
                {
                    round:false,
                    subject: 'New training session',
                    id: '0404040404',
                    password: '1234568',
                    duration: '2016/09/30 04:00:00',
                },
                {
                    round:true,
                    subject: 'New training session',
                    id: '123456',
                    password: '12345',
                    duration: '2016/09/30 04:00:00',
                },
                {
                    round:true,
                    subject: 'New training session',
                    id: '123456',
                    password: '123456',
                    duration: '2016/09/30 04:00:00',
                },
                {
                    round:false,
                    subject: 'New training session',
                    id: '123456',
                    password: '1234567',
                    duration: '2016/09/30 04:00:00',
                },
                {
                    round:false,
                    subject: 'New training session',
                    id: '123456',
                    password: '12345',
                    duration: '2016/09/30 04:00:00',
                },
                {
                    round:true,
                    subject: 'New training session',
                    id: '123456',
                    password: '123456',
                    duration: '2016/09/30 04:00:00',
                },
                {
                    round:true,
                    subject: 'New training session',
                    id: '123456',
                    password: '1234567',
                    duration: '2016/09/30 04:00:00',
                }
            ]

    }
];
// const Confs = [];

// for (let i = 0; i < 86; i++) {
//     Confs.push(Mock.mock({
//         id: Mock.Random.guid(),
//         subject: Mock.Random.cname(),
//         addr: Mock.mock('@county(true)'),
//         'age|18-60': 1,
//         birth: Mock.Random.date(),
//         sex: Mock.Random.integer(0, 1)
//     }));
// }
export {ControlList};
