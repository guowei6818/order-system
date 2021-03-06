/*
 * @Author: your name
 * @Date: 2019-11-24 19:28:38
 * @LastEditTime : 2020-01-12 12:07:17
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \order-system\frontend\src\create-fetcher.js
 */
export default function(f){
	var cache = {}

	return {
		read(...args){
			var key = args.join('|')
			if(key in cache){
				return cache[key]
			}else{
				throw f(...args).then(val => {
					cache[key] = val
				})
			}
		}
	}
}