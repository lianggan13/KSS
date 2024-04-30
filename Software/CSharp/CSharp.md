## C#

### C# 10.0

Keys: with、record

```c#
var parse = (string s) => int.Parse(s);
var choose = [Obsolete] object (bool b) => b ? 1 : "2";

var apples = new { Item = "Apples", Price = "1.19" };
Console.WriteLine($"original apples: {apples}");
var saleApples = apples with { Price = "0.79" };
Console.WriteLine($"sale apples: {saleApples}");

public readonly record struct Point1(double X, double Y, double Z);

public record struct Point2
{
    public double X { get; init; }
    public double Y { get; init; }
    public double Z { get; init; }
}

public record Person
{
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
};
```



#### 类型

```c#
值类型：
    int、char、float、decimal、bool、enum、struct
引用类型：
    object、string、class、interface、Array、[]、delegate
泛型：
    public class BaseModel<T> where T:class,new()
    public static string ExtensioFunc<T>(this T t) where T:Enum
    
```

#### 接口

用于定义协定，应用程序通过协定和插件进行交互，并且插件也通过协定与应用程序进行交互

#### 反射

AbstractFactory + ConfigurationManager + string (Assembly Namespace Class)

依赖注入：通过 IOC 容器创建对象，注入对象参数（构造函数注入，属性注入，接口注入）

Keys: 获取私有属性(字段)

```c#
var pi = sender.GetType().GetProperty("VisualOffset", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
var offset = ((Vector)pi.GetValue(sender)).X;
```

插件：动态从单独的程序集中发现和加载插件类型

### Concurrency

#### Thread Safe

1. [**ConcurrentDictionary< Key, Value>**](https://dotnettutorials.net/lesson/concurrentdictionary-collection-class-in-csharp/): Thread-safe version of Generic Dictionary.
2. [**ConcurrentQueue**](https://dotnettutorials.net/lesson/concurrentqueue-collection-class-in-csharp/): Thread-safe version of the generic queue (FIFO Data Structure).
3. [**ConcurrentStact**](https://dotnettutorials.net/lesson/concurrentstack-collection-class-csharp/): Thread-safe version of generic stack (LIFO Data Structure).
4. [**ConcurrentBag**](https://dotnettutorials.net/lesson/concurrentbag-collection-class-in-csharp/): Thread-safe implementation of an unordered collection.
5. [**BlockingCollection**](https://dotnettutorials.net/lesson/blockingcollection-class-in-csharp/): Provides a Classical Producer-Consumer pattern.

```
C# .Net 线程同步的各种技术，及其应用场景
互斥锁: 仅允许一个线程使用
	lock
	Monitor lock 由C#编译器解析为 Monitor 类
	SpinLock 适合量大、短时间锁定
	Mutex 支持跨进程

信号量：支持同时多个线程使用、可控线程数量
	Semaphore
	SemaphoreSlim 短时间、轻量级

事件: 等待信号的线程保持阻塞状态
	ManualResetEvent
	ManualResetEventSlim
	CountdownEvent	多线程执行，合并结果
	AutoResetEvent
	
	Barrier 允许多个线程，在同一个时刻汇总
	
```



#### Parallel

```c#
var sw = Stopwatch.StartNew()
sw.Restart();
sw.Stop();

Console.WriteLine($"Serial  :\t{result}\t{sw.Elapsed}");
Console.WriteLine($"{function.PadRight(22)} | {sw.Elapsed} | {pi}");

static double ParallelLinqPi()
{
	double step = 1.0 / (double)NumberOfSteps;
	return (from i in ParallelEnumerable.Range(0, NumberOfSteps)
			let x = (i + 0.5) * step
			select 4.0 / (1.0 + x * x)).Sum() * step;
}

static double ParallelPi()
{
	double sum = 0.0;
	double step = 1.0 / (double)NumberOfSteps;
	object monitor = new object();
	Parallel.For(0, NumberOfSteps, () => 0.0, (i, state, local) =>
	{
		//state.Break
		double x = (i + 0.5) * step;
		return local + 4.0 / (1.0 + x * x);
	}, local =>
	{
		lock (monitor)
			sum += local;
	});
	return step * sum;
}

static double ParallelPartitionerPi()
{
	double sum = 0.0;
	double step = 1.0 / (double)NumberOfSteps;
	object monitor = new object();
	Parallel.ForEach(Partitioner.Create(0, NumberOfSteps), () => 0.0, (range, state, local) =>
	{
		for (int i = range.Item1; i < range.Item2; i++)
		{
			double x = (i + 0.5) * step;
			local += 4.0 / (1.0 + x * x);
		}
		return local;
	}, local => { lock (monitor) sum += local; });
	return step * sum;
}


private static int ParallelEditDistance(string s1, string s2)
{
	int[,] dist = new int[s1.Length + 1, s2.Length + 1];
	for (int i = 0; i <= s1.Length; i++) dist[i, 0] = i;
	for (int j = 0; j <= s2.Length; j++) dist[0, j] = j;
	int numBlocks = Environment.ProcessorCount * 4;

	ParallelAlgorithms.Wavefront(
		s1.Length, s2.Length,
		numBlocks, numBlocks,
		(start_i, end_i, start_j, end_j) =>
	{
		for (int i = start_i + 1; i <= end_i; i++)
		{
			for (int j = start_j + 1; j <= end_j; j++)
			{
				dist[i, j] = (s1[i - 1] == s2[j - 1]) ?
					dist[i - 1, j - 1] :
					1 + Math.Min(dist[i - 1, j],
						Math.Min(dist[i, j - 1],
								 dist[i - 1, j - 1]));
			}
		}
	});

	return dist[s1.Length, s2.Length];
}

List<string> wildcards ...
var files = from wc in wildcards
			let dirName = Path.GetDirectoryName(wc)
			let fileName = Path.GetFileName(wc)
			from file in Directory.EnumerateFiles(
				string.IsNullOrWhiteSpace(dirName) ? "." : dirName,
				string.IsNullOrWhiteSpace(fileName) ? "*.*" : fileName,
				recursive ? SearchOption.AllDirectories : SearchOption.TopDirectoryOnly)
			select file;

try
{
	// Traverse the specified files in parallel, and run each line through the Regex, collecting line number info
	// for each match (the Zip call counts the lines in each file)
	var matches = from file in files.AsParallel().AsOrdered().WithMergeOptions(ParallelMergeOptions.NotBuffered)
				  from line in File.ReadLines(file)
							   .Zip(Enumerable.Range(1, int.MaxValue), (s, i) => new { Num = i, Text = s, File = file })
				  where regex.Value.IsMatch(line.Text)
				  select line;
	foreach (var line in matches)
	{
		Console.WriteLine($"{line.File}:{line.Num} {line.Text}");
	}
}
catch (AggregateException ae)
{
	ae.Handle(e => { Console.WriteLine(e.Message); return true; });
}



ParallelQuery<TSource>
	.WithMergeOptions
	.WithCancellation
	.WithDegreeOfParallelism // 并行化查询的处理器的最大数目



// 在并行循环内重复操作的对象，必须要是thread-safe(线程安全)的。集合类的线程安全对象全部在System.Collections.Concurrent命名空间

 

/// <summary>
/// 具有线程局部变量的For循环
/// </summary>
private void Demo9()
{
    List<int> data = Program.Data;
    long total = 0;
    //这里定义返回值为long类型方便下面各个参数的解释
    Parallel.For<long>(0,           // For循环的起点
        data.Count,                 // For循环的终点
        () => 0,                    // 初始化局部变量的方法(long)，既为下面的subtotal的初值
        (i, LoopState, subtotal) => // 为每个迭代调用一次的委托，i是当前索引，LoopState是循环状态，subtotal为局部变量名
        {
            subtotal += data[i];    // 修改局部变量
            return subtotal;        // 传递参数给下一个迭代
        },
        (finalResult) => Interlocked.Add(ref total, finalResult) //对每个线程结果执行的最后操作，这里是将所有的结果相加
        );
    Console.WriteLine(total);
}
/// <summary>
/// 具有线程局部变量的ForEach循环
/// </summary>
private void Demo10()
{
    List<int> data = Program.Data;
    long total = 0;
    Parallel.ForEach<int, long>(data, // 要循环的集合对象
        () => 0,                      // 初始化局部变量的方法(long)，既为下面的subtotal的初值
        (i, LoopState, subtotal) =>   // 为每个迭代调用一次的委托，i是当前元素，LoopState是循环状态，subtotal为局部变量名
        {
            subtotal += i;            // 修改局部变量
            return subtotal;          // 传递参数给下一个迭代
        },
        (finalResult) => Interlocked.Add(ref total, finalResult) //对每个线程结果执行的最后操作，这里是将所有的结果相加
        );
    Console.WriteLine(total);
}
```





 #### 内存管理

托管资源 与 非托管资源

一个对象没有任何标签（引用），c#就会被将对象从内存中进行垃圾回收

多个引用意味多个途径改变一个对象的数据 

对于***\*托管资源\****，.Net clr把所有的引用对象都分配到***\*托管堆\****上，当对象使用完后或者或没有任何引用标签指向该对象的时候，.Net clr 会将对象从内存中进行回收。

对于***\*非托管资源\****，需要进行手动释放，开发人员通常会把清理这类资源的代码写到Close、Dispose或者Finalize方法中



#### Communication

Keys: MQTT、WebSocket、SignalR

```c#
MQTT 与 WebSocket 的联系与区别 是什么？

构建于 TCP/IP 协议之上的 应用层传输 协议
具有可靠性、实时性
支持双向通信

WebSocket 报文协议简单
MQTT 拥有复杂的消息投递协议，支持消息 发布--订阅 

WebSocket 应用 Web 开发，浏览器与服务器全双工通信
MQTT 应用 IoT 场景，用于与各个远端硬件设备之间的通信

SignalR 是什么？
.Net 实时 Web 应用开发开源库
集成了数种常见的消息传输方式，如long polling，WebSocket
用于快速构建需要实时进行用户交互和数据更新的 Web 应用，如 股票、天气、硬件设备信息更新
```

### Preofession C#

Keys: 异步编程
```c#
1.BeginXXX/EndXXX
2.EAP
3.TAP (async/await Task)

await 关键字会解除调用线程(如 UI线程)的阻塞，完成其他任务，当异步方法完成其后台处理后，调用线程(UI线程)继续执行，并从后台任务中获得结果

ConfigureAwait(bool) 异步方法完成后，是否切换到同步上下文(若 await 后的代码没有用到任何 UI 元素，避免切换到同步上下文会执行得更快)
WPF、WinForm、UWP、异步完成并放回时，默认切换得到 UI 线程


多个异步方法互不依赖，且返回类型相同吗，可考虑使用组合器
	Task<string> t1 = GreetingAsync("Stephanie");
	Task<string> t2 = GreetingAsync("Matthias");
	string[] result = await Task.WhenAll(t1, t2);



ValueTask,缓存异步结果,避免创建 Task 开销
	private readonly static Dictionary<string, string> names = new Dictionary<string, string>();

	static async ValueTask<string> GreetingValueTaskAsync(string name)
	{
		if (names.TryGetValue(name, out string result))
		{
			return result;
		}
		else
		{
			result = await GreetingAsync(name);
			names.Add(name, result);
			return result;                
		}
	}

	static ValueTask<string> GreetingValueTask2Async(string name)
	{
		if (names.TryGetValue(name, out string result))
		{
			return new ValueTask<string>(result);
		}
		else
		{
			Task<string> t1 =  GreetingAsync(name);
			
			TaskAwaiter<string> awaiter = t1.GetAwaiter();
			awaiter.OnCompleted(OnCompletion);
			return new ValueTask<string>(t1);

			void OnCompletion()
			{
				names.Add(name, awaiter.GetResult());
			}
		}
	}

显示所有异步任务的异常
private static async void ShowAggregatedException()
{
	Task taskResult = null;
	try
	{
		Task t1 = ThrowAfter(2000, "first");
		Task t2 = ThrowAfter(1000, "second");
		await (taskResult = Task.WhenAll(t1, t2));
	}
	catch (Exception ex)
	{
		// just display the exception information of the first task that is awaited within WhenAll
		Console.WriteLine($"handled {ex.Message}");
		foreach (var ex1 in taskResult.Exception.InnerExceptions)
		{
			Console.WriteLine($"inner exception {ex1.Message} from task {ex1.Source}");
		}
	}
}

```



### 面试

关键点：专业能力(技术、处理问题)、语言表达能力(逻辑、论点，论据、论证，推论)

问题：

> + 很多Service 部署到一台服务器上，如何应对产生争抢资源的现象？
>
> 	合理分配服务，避免资源竞争。如：将No-sql redis 分布式缓存 与主SQLSERVER数据库分开；Web 主站点与升级服务 以及图片服务 分离，因为它们非常消耗带宽。
>
> + 一台（单台）服务器的线程数是有限的，链接数是有限的，如何进行分流处理？
>
> 	应用集群方案NLB，完成请求分发，不同机器轮询处理请求，把压力分布到不同机器上，解决单台服务器处理有限的情景。
>
> 	 + 高并发数据库访问，如何处理读写死锁？如何实现高性能高并发插入、查询？
>
> 	数据库集群读写分离，把插入的主库全部用来插入操作，大部分的读操作去从库读取。
>
> 	产生死锁的情况大大降低。使用基于内存的数据库No-sql，如 MongoDB,redis，完成高性能高并发插入、查询。
>
> + 分布式服务器如何共享缓存数据，用户状态，同步不同机器之间数据同步的问题？
>
> 	使用Memcache分布式缓存，但缺乏持久化和容灾能力，所以改用 redis。

