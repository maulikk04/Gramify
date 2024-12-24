import Layout from '@/components/layout';
import { getPost } from '@/repository/post.service';
import { DocumentResponse } from '@/types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from '@/components/postCard';
import PageTransition from '@/components/PageTransition';

const SinglePost = () => {
    const { id } = useParams();
    const [post, setPost] = useState<DocumentResponse | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (id) {
                const postDoc = await getPost(id);
                if (postDoc.exists()) {
                    setPost({
                        id: postDoc.id,
                        ...postDoc.data()
                    } as DocumentResponse);
                }
            }
        };

        fetchPost();
    }, [id]);

    return (
        <Layout>
            <PageTransition>
                <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
                    <div className="container mx-auto px-4 py-8">
                        {post ? (
                            <PostCard data={post} />
                        ) : (
                            <div className="flex items-center justify-center h-40">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"/>
                            </div>
                        )}
                    </div>
                </div>
            </PageTransition>
        </Layout>
    );
};

export default SinglePost;
