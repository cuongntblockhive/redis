const pageCacheKey = (id: string) => `pagecache#${id}`;
const userKey = (id:string) => `user#${id}`;
const sessionKey = (id: string) => `session#${id}`
const itemKey = (id:string) => `item${id}`
export {
    pageCacheKey,
    userKey,
    sessionKey,
    itemKey,
}