1.babel6默认添加use strict,arguments,callee等就不能使用。
去掉strict 模式
安装 babel-plugin-transform-remove-strict-mode
修改.babelrc
  {
    "presets": [
      ["env", {
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        }
      }],
      "stage-2"
    ],
    "plugins": ["transform-runtime","transform-remove-strict-mode" ],
    "env": {
      "test": {
        "presets": ["env", "stage-2"],
        "plugins": ["istanbul"]
      }
    }
  }
2.Uploader.swf要放到static目录下才能正确访问。
3.crossdomain.xml要放到服务器根目录//大概是非必须，跨域请求设置，如果服务器没有设置跨域请求。。
4.示例：
修改 webpack loader
<!-- {
  test: /\.(woff2?|eot|ttf|otf|swf)(\?.*)?$/,
  loader: 'url-loader',
  options: {
    limit: 10000,
    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
  }
} -->
import upload from '@/components/uploader'
Vue.use(upload)
 <!-- config :  {
             server: '/api/v1/resource/upload',
             fileNumLimit: 5,
             fileSizeLimit: 50 * 1024 * 1024,
             fileSingleSizeLimit: 6 * 1024 * 1024,
             accept: {
               title: 'Images',
               extensions: 'gif,jpg,jpeg,bmp,png',
               mimeTypes: 'image/*'
               },
             headers: {
               'token': '4c5bf6dd649b4c188dfd7ea5ab725f45'
                }
             }  -->
<yl-upload :configs="myConfig"></yl-upload>
<yl-upload :configs="myConfig" showType="logo" :className="styleName">
<div slot="hint">
1111111111111111111
</div>
</yl-upload>
styleName:{
width:'200px',
height:'200px'
}
5.accept 参数可参看mimetypes.js
6.需要参数列表
showType: file,logo,img-list，默认file
uploadIcon：上传图标
className:logo 需要的大小
configs: 参看webuploader
7.回调方法
beforeUpload -- 校验错误回传错误类型码
fileDequeued -- 删除文件，回传file，如果需要向服务器发出删除请求。
uploadSuccess -- 上传成功回传response 和 file
uploadFail -- 上传失败回传 response
