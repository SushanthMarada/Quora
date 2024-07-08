const Post = require('../models/post');
const User = require('../models/user');

class postController {
    async createPost(request,reply){
        const {authorID,body} = request.body;
        try {
            const author = await User.findById(authorID);
            if (!author) {
                return reply.status(404).send({ msg: 'Author not found' });
            }

            const post = new Post({authorID, body});
            await post.save();
            return reply.status(201).send({ msg: 'Post created successfully', post });
        } catch (err) {
            console.error(err.message);
            return reply.status(500).send({ msg: 'Server error' });
        }
    };

    async getPosts(request,reply){
        const { authorID } = request.params;
        try {
            const user = await User.findById(authorID);
            if (!user) {
                return reply.status(404).send({ msg: 'User not found' });
            }

            const posts = await Post.find({ authorID });
            return reply.status(200).send(posts);
        } catch (err) {
            console.error(err.message);
            return reply.status(500).send({ msg: 'Server error' });
        }
    };

    async getPostbyId(request,reply){
        const { id } = request.params;

        try {
            const post = await Post.findById(id);
            if (!post) {
                return reply.status(404).send({ msg: 'Post not found' });
            }
            return reply.status(200).send(post);
        } catch (err) {
            console.error(err.message);
            return reply.status(500).send({ msg: 'Server error' });
        }
    };

    async updatePost(request,reply){
        const {id} = request.params;
        const {body,authorID} = request.body;

        try {
            const post = await Post.findById(id);
            if(!post){
                return reply.status(404).send({ msg: 'Post not found' });
            }
            if(post.authorID.toString() !== authorID){
                return reply.status(403).send({ msg: 'Unauthorized to update this question' });
            }
            post.body = body || post.body;
            // post.updatedAt = Date.now();
            await post.save();
            return reply.status(200).send({ msg: 'Post updated successfully', post });
        }
        catch(err){
            console.error(err.message);
            return reply.status(500).send({ msg: 'Server error' });
        }
    };

    async deletePost(request,reply){
        const {id} = request.params;
        try {
            const result = await Post.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                return reply.status(404).send({ msg: 'Post not found' });
            }
            return reply.status(200).send({ msg: 'Post deleted successfully' });
        } catch (err) {
            console.error(err.message);
            return reply.status(500).send({ msg: 'Server error' });
        }
    };
    
}

module.exports = new postController();