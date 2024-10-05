## C#

### 委托	delegate

 一种特殊的类型，其声明的变量可以指向兼容签名的方法，允许将方法作为参数传递给其它方法，是实现回调机制、事件处理的基础。



### 线程 	Thread

局限：创建和销毁线程是一个昂贵的操作，要耗费大量时间。另外，太多的线程会浪费内存资源。由于操作系统必须调度可运行的线程并执行上下文切换，所以太多的线程还对性能不利。

### 线程池	ThreadPool

在 CLR 内部，线程池维护了一个操作请求队列。应用程序执行一个异步操作时，就调用某个方法，将一个记录项(entry)追加到线程池的队列中。线程池的代码从这个队列中提取记录项，将这个记录项派发(dispatch)给一个线程池线程。如果线程池中没有线程，就创建一个新线程。创建线程会造成一定的性能损失。然而，当线程池线程完成任务后，线程不会被销毁。相反，线程会返回线程池，在那里进入空闲状态，等待响应另一个请求。由于线程不销毁自身，所以不再产生额外的性能损失。

如果你的应用程序向线程池发出许多请求，线程池会尝试只用这一个线程来服务所有请求。然而，如果你的应用程序发出请求的速度超过了线程池线程处理它们的速度，就会创建额外的线程。最终，你的应用程序的所有请求都能由少量线程处理，所以线程池不必创建大量线程。

如果你的应用程序停止向线程池发出请求，池中会出现大量什么都不做的线程。这是对内存资源的浪费。所以，当一个线程池线程闲着没事儿一段时间之后，线程会自己醒来终止自己以释放资源。线程终止自己会产生一定的性能损失。然而，线程终止自己是因为它闲的慌，表明应用程序本身就么有做太多的事情，所以这个性能损失关系不大。

线程池可以只容纳少量线程，从而避免浪费资源；也可以容纳更多的线程，以利用多处理器、超线程处理器和多核处理器。

### 任务	Task

ConfigureAwait

```
ConfigureAwait(false) 连续任务可以在任何线程上执行,避免线程切换
ConfigureAwait(true) 或者不使用 ConfigureAwait，默认行为
```



TaskCreationOptions

```
[Flags, Serializable]
public enum TaskCreationOptions {
    None           = 0x0000,      // 默认
    // 提议 TaskScheduler 你希望该任务尽快执行
    PreferFairness = 0x0001,
    // 提议 TaskScheduler 应尽可能地创建线程池线程
    LongRunning    = 0x0002,
    // 该提议总是被采纳：将一个 Task 和它的父 Task 关联(稍后讨论)
    AttachedToParent = 0x0004,
    // 该提议总是被采纳：如果一个任务试图和这个父任务连接，它就是一个普通任务，而不是子任务
    DenyChildAttach = 0x0008,
    // 该提议总是被采纳：强迫子任务使用默认调度器而不是父任务的调度器
    HideScheduler = 0x0010
}
```

TaskStatus

```c#
public enum TaskStatus {
    // 这些标志指出一个 Task 在其生命期内的状态
    Created,                // 任务已显示创建：可以手动 Start() 这个任务
    WaitingForActivation,   // 任务已隐式创建：会自动开始
    WaitingToRun,           // 任务已调度，但尚未运行
    Running,                // 任务正在运行
    // 任务正在等待他的子任务完成，子任务完成后它才完成
    WaitingForChildrenToComplete,
    // 任务的最终状态是一下三个之一：
    RanToCompletion,
    Canceled,
    Faulted
}
```

TaskContinuationOptions

```c#
[Flags, Serializable]
public enum TaskContinuationOptions
{
    None                    = 0x0000,  // 默认
    // 提议 TaskScheduler 你希望该任务尽快执行.
    PreferFairness          = 0x0001,
    // 提议 TaskScheduler 应尽可能地创建池线程线程
    LongRunning             = 0x0002,
    // 该提议总是被采纳：将一个 Task 和它的父 Task 关联(稍后讨论) 
    AttachedToParent        = 0x0004,
    // 任务试图和这个父任务连接将抛出一个 InvalidOperationException
    DenyChildAttach         = 0x0008,
    // 强迫子任务使用默认调度器而不是父任务的调度器
    HideScheduler           = 0x0010,
    // 除非前置任务(antecedent task)完成，否则禁止延续任务完成(取消)
    LazyCancellation        = 0x0020,
    // 这个标志指出你希望由执行第一个任务的线程执行
    // ContinueWith 任务。第一个任务完成后，调用
    // ContinueWith 的线程接着执行 ContinueWith 任务 ①
    ExecuteSynchronously    = 0x80000,
    // 这些标志指出在什么情况下运行 ContinueWith 任务
    NotOnRanToCompletion    = 0x10000,
    NotOnFaulted            = 0x20000,
    NotOnCanceled           = 0x40000,
    // 这些标志是以上三个标志的便利组合
    OnlyOnRanToCompletion   = NotOnRanToCompletion | NotOnFaulted, //0x60000,
    OnlyOnFaulted           = NotOnRanToCompletion | NotOnCanceled,// 0x50000,
    OnlyOnCanceled          = NotOnFaulted | NotOnCanceled,// 0x30000
}
```





### 线程同步

#### Volatile

```
C# 中的 Volatile 关键字主要用于解决多线程编程中的内存可见性问题。它具有以下主要作用:

内存可见性:
在多线程环境中,一个线程对共享变量的修改可能对其他线程不可见。
使用 Volatile 关键字修饰的变量可以确保其修改对其他线程是可见的,从而避免出现数据不一致的问题。
防止指令重排:
现代编译器和CPU都可能会对指令进行重排优化,以提高性能。
使用 Volatile 可以防止编译器和CPU对被修饰变量的访问指令进行重排,确保代码执行的顺序性。
禁用缓存:
在多线程环境中,每个线程可能会在自己的缓存中保存共享变量的副本。
使用 Volatile 可以禁用对被修饰变量的缓存,确保读写操作直接访问主存。
具体来说,C# 中提供了以下两个 Volatile 相关的方法:

Volatile.Read(ref T): 读取一个被 Volatile 修饰的变量,确保读取的值是最新的。
Volatile.Write(ref T, T): 写入一个被 Volatile 修饰的变量,确保写入的值对其他线程立即可见。
通常在多线程共享数据的场景中,我们会使用 Volatile.Read() 和 Volatile.Write() 来确保线程间的数据同步,避免出现竞争条件和数据不一致的问题。

总之, Volatile 关键字和相关方法是 C# 中解决多线程编程中内存可见性问题的重要工具,在并发编程中扮演着非常重要的角色。
```

#### Interlocked

```c#
Interlocked.Add

if (Interlocked.Exchange(ref m_statusReported, 1) == 0)
	...


原子操作，运行快，但主要操作 Int 值
    
delegate Int32 Morpher<TResult, TArgument>(Int32 startValue, TArgument argument,
    out TResult morphResult);
static TResult Morph<TResult, TArgument>(ref Int32 target, TArgument argument,
    Morpher<TResult, TArgument> morpher) {
    TResult morphResult;
    Int32 currentVal = target, startVal, desiredVal;
    do {
        startVal = currentVal;
        desiredVal = morpher(startVal, argument, out morphResult);
        currentVal = Interlocked.CompareExchange(ref target, desiredVal, startVal);
    } while (startVal != currentVal);
    return morphResult;
}
```

#### SpinLock

```
在存在对锁的竞争的前提下，会造成线程“自旋”。这个“自旋”会浪费宝贵的 CPU 时间，阻止 CPU 做其他更有用的工作。因此，自旋锁只应该用于保护那些会执行得非常快的代码区域。
```

#### WaitHandle

```
内核模式的构造来同步线程
semaphores 翻译成“信号量”，mutex 翻译成“互斥体”

WaitHandle
    EventWaitHandle
        AutoResetEvent 自动重置事件
        ManualResetEvent 手动重置事件
    Semaphore 信号量
    Mutex 互斥锁
 
 WaitOne 与 Set： 每一个调用都强迫调用线程从托管代码转换为内核代码，再转换回来————这是不好的地方。但在存在竞争的时候，输掉的线程会被内核阻塞，不会在那里“自旋”，从而浪费 CPU 时间————这是好的地方。
 
 调用 WaitOne 造成线程的代码转变成内核模式的代码，这会对性能产生巨大影响
 线程现在会阻塞，不会因为在 CPU 上“自旋”而浪费 CPU 时间。
 
 调用 Set 来实现的。这会造成性能上的损失，因为线程必须转换成内核模式代码，再转换回来。
 
 线程同步能避免就尽量避免。如果一定要进行线程同步，就尽量使用用户模式的构造。内核模式的构造要尽量避免
```

#### Slim

```c#
混合构造
在用户模式中“自旋”，而且都推迟到发生第一次竞争时，才创建内核模式的构造

ManualResetEventSlim
SemaphoreSlim

ReaderWriterLockSlim
如果这些数据被一个互斥锁(比如 SimpleSpinLock，SimpleWaitLock，SimpleHybridLock，AnotherHybridLock，Mutex 或者 Monitor)保护，那么当多个线程同时试图访问这些数据时，只有一个线程才会运行，其他所有线程都会阻塞。这会造成应用程序伸缩性和吞吐能力的急剧下降。如果所有线程都希望以只读方式访问数据，就根本没有必要阻塞它们；应该允许它们并发地访问数据。另一方面，如果一个线程希望修改数据，这个线程就需要对数据的独占式访问。

CountdownEvent
Barrier
```

#### 建议

```
代码尽量不要阻塞任何线程。执行异步计算或 I/O 操作时，将数据从一个线程交给另一个线程时，应避免多个线程同时访问数据。如果不能完全做到这一点，请尽量使用 Volatile 和 Interlocked 的方法，因为它们的速度很快，而且绝不阻塞线程。遗憾的是，这些方法只能操作简单类型。
```

#### 异步的同步构造

```
任务具有下述许多优势。

任务使用的内存比线程少得多，创建和销毁所需的时间也少得多。
线程池根据可用 CPU 数量自动伸缩任务规模。
每个任务完成一个阶段后，运行任务的线程回到线程池，在哪里能接受新任务。
线程池是站在整个进程的高度观察任务。所以，它能更好地调度这些任务，减少进程中的线程数，并减少上下文切换。
```

#### 并发集合类

```
ConcurrentQueue，ConcurrentStack，ConcurrentDictionary 和 ConcurrentBag
几乎 非阻塞
```

### 异常 	Exception

```c#
public static class SomeType {
  private static Object s_myLockObject = new Object();
  public static void SomeMethod() {
      Boolean lockTaken = false;      // 假定没有获取锁
      try {
          // 无论是否抛出异常，以下代码都能正常工作!
          Monitor.Enter(s_myLockObject, ref lockTaken);
          // 在这里执行线程安全的操作...
      }
      finally {
          // 如果已获取锁，就释放它
          if (lockTaken) Monitor.Exit(s_myLockObject);
      }
  }
  // ...
}


public void SerializeObjectGraph(FileStream fs, IFormatter formatter, Object rootObj) {
    // 保存文件的当前位置
    Int64 beforeSerialization = fs.Position;
    try {
        // 尝试将对象图序列化到文件中
        formatter.Serialize(fs, rootObj);
    }
    catch {   // 捕捉所有异常
        // 任何事情出错，就将文件恢复到一个有效状态
        fs.Position = beforeSerialization;
        // 截断文件
        fs.SetLength(fs.Position);
        // 注意： 上述代码没有放到 finally 块中，因为只有在
        // 序列化失败时才对流进行重置
        // 重新抛出相同的异常，让调用者知道发生了什么
        throw;
    }
}

private static void SomeMethod(String filename) {
    try {
        // 这里随便做什么...
    }
    catch (IOException e) {
        // 将文件名添加到 IOException 对象中
        e.Data.Add("Filename", filename);
        throw;  // 重新抛出同一个异常对象，只是它现在包含额外的数据
    }
}
```




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

