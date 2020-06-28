import React,{useState} from 'react'
import Head from 'next/head'
import {Row, Col , Icon ,Breadcrumb,Affix  } from 'antd'
//子组件
import Header from '../components/Header'
import Author from '../components/Author'
import Advert from '../components/Advert'
import Footer from '../components/Footer'

import '../public/style/pages/detailed.css'

//解析marked  和 高亮
import marked from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css';

import MarkNav from 'markdown-navbar'
import 'markdown-navbar/dist/navbar.css'   //自带css

import Tocify from '../components/tocify.tsx'
import axios from 'axios'

//先进行引入
import  servicePath  from '../config/apiUrl'

const Detailed = (props) => {

  //使用marked必须引入Renderer
  const renderer=new marked.Renderer()

  const tocify = new Tocify()
  renderer.heading = function(text, level, raw) {
      const anchor = tocify.add(text, level);
      return `<a id="${anchor}" href="#${anchor}" class="anchor-fix"><h${level}>${text}</h${level}></a>\n`;
    };
    
    //设置属性
  marked.setOptions({
    renderer:renderer,
    gfm:true,   
    pedantic:false,  //容错
    sanitize: false,  //不忽略html
    tables:true,       //允许表格
    breaks:false,     //换行符
    smartLists:true,    //自动渲染
    //如何让代码高亮
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  })
  //转化为html
  let html=marked(props.article_content)

  return(
    <div>
    <Head>
      <title>Detailed</title>
    </Head>
    <Header />
    <Row className="comm-main" type="flex" justify="center">
      <Col className="comm-left" xs={24} sm={24} md={16} lg={18} xl={14}  >
        <div>
          <div className="bread-div">
              <Breadcrumb>
                <Breadcrumb.Item><a href="/">首页</a></Breadcrumb.Item>
                <Breadcrumb.Item>{props.typeName}</Breadcrumb.Item>
                <Breadcrumb.Item>{props.title}</Breadcrumb.Item>
              </Breadcrumb>
          </div>
        </div>

        <div>
          <div className="detailed-title">
            {props.title}
          </div>

          <div className="list-icon center">
                  <span><Icon type="calendar" /> {props.addTime}</span>
                  <span><Icon type="folder" /> {props.typeName}</span>
                  <span><Icon type="fire" /> {props.view_count}</span>
          </div>
          <div className="detailed-content" dangerouslySetInnerHTML={{__html:html}}>
             
          </div>
        </div>

      </Col>

      <Col className="comm-right" xs={0} sm={0} md={7} lg={5} xl={4}>
        <Author />
        <Advert />
        <Affix offsetTop={5}>
          <div className="detailed-nav comm-box">
            <div className="nav-title">文章目录</div>
            {/* <MarkNav
             className="article-menu"
             source={html}

            ordered={false}*/}
              <div className="toc-list">
                {tocify && tocify.render()}
              </div>
          
          </div>
       </Affix>
      </Col>
    </Row>
    <Footer />

  </div>
  )
}

Detailed.getInitialProps = async(context)=>{

  //console.log(context.query.id)
  let id =context.query.id
  const promise = new Promise((resolve)=>{

    axios(servicePath.getArticleById+id).then(
      (res)=>{
        // console.log(res.data)
        resolve(res.data.data[0])
      }
    )
  })
   //必须要返回
  return await promise
}


export default Detailed
  


