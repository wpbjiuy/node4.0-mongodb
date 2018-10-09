/** 此函数为构造函数
* 数组对象排序方法，主要用户对数据进行排序
* 方法默认为升序
* result.sort => 排序方法
* result.ab => 升序方法
* result.ba => 降序方法
* result.sort(ar, at, sequence): ar=>数据(object)， at=>数据 key 值(string)， sequence=>排序顺序(function)
**/
function FnSort(){
	var result = {}
	result.sort = function(ar, at, sequence) {
		for (var i = 0; i < ar.length-1; i++) {
			if(sequence ? sequence(ar[i][at].toLowerCase(), ar[i+1][at].toLowerCase()) : ar[i][at].toLowerCase() > ar[i+1][at].toLowerCase()) {
				var ac= ar[i];
				ar[i] = ar[i+1];
				ar[i+1] = ac;
				sequence ? this.sort(ar, at, sequence) : this.sort(ar, at);
				break;
			}
		}
		return ar;
	}
	result.ab = function(a,b){return a > b;}
	result.ba = function(a,b){return a < b;}
	return result;
}
