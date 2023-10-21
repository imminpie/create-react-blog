import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../css/PostForm.module.css';
import ModalBase from '../components/ModalBase';
import { FaArrowLeft } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function PostEdit() {
  const createDate = new Date().getTime();
  const location = useLocation();
  const navigate = useNavigate();
  const titleInput = useRef();
  const contentInput = useRef();

  const [store, setStore] = useState(() => readTodoFromLocalStorage());
  const [post, setPost] = useState(location.state.post[0]);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [isPost, setIsPost] = useState(false);
  const [status, setStatus] = useState(false);
  const [isModal, setIsModal] = useState({status: false, title: '', cancle: false,});


  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim().length === 0) {
      titleInput.current.focus();
      return handleEmptyFields('제목을 입력하세요');
    }

    if (content.trim().replaceAll(/<[^>]*>?/g, '').length === 0) {
      contentInput.current.focus();
      return handleEmptyFields('내용을 입력하세요');
    }

    setPost((prev) => ({
      ...prev,
      title,
      content,
      date: new Date(createDate).toLocaleDateString(),
    }));
    setIsPost(!isPost);
  };

  const handleEmptyFields = (title) => {
    setIsModal({ status: true, title: title, cancle: false });
  };

  const handleCandle = () => {
    setIsModal({ status: !isModal, title: '', cancle: false });
  };

  useEffect(() => {
    if (isPost) {
      setStore(store.map((prev) => (prev.id === post.id ? post : prev)));
      setStatus(!status);
    }
  }, [isPost]);

  useEffect(() => {
    if (status) {
      status && localStorage.setItem('posts', JSON.stringify(store));
      navigate(`/post/${post.id}`);
    }
  }, [status]);

  return (
    <form className='wrap' onSubmit={handleSubmit}>
      <div className={`${styles.form} inner`}>
        <input
          type='text'
          name='title'
          value={title}
          ref={titleInput}
          onChange={handleChange}
          placeholder='제목을 입력하세요'
        />
        <ReactQuill
          value={content}
          theme='snow'
          ref={contentInput}
          onChange={setContent}
          placeholder='내용을 입력하세요.'
        />
      </div>
      <div className={styles.button_area}>
        <div className={`${styles.buttons} inner`}>
          <button
            onClick={() => navigate(`/post/${post.id}`)}
            className={styles.cancle}
          >
            <FaArrowLeft />
            <span>나가기</span>
          </button>
          <button type='submit' className='button button_primary'>
            수정
          </button>
        </div>
      </div>
      {isModal && <ModalBase show={isModal} onConfirm={handleCandle} />}
    </form>
  );
}

function readTodoFromLocalStorage() {
  const posts = localStorage.getItem('posts');
  return posts ? JSON.parse(posts) : [];
}
