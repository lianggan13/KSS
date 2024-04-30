## Asp.Net Core

### Run

```c#
set ASPNETCORE_URLS=http://192l.168.1.102:8081
dotnet Y.DP.Shen12.Server.dll
    
dotnet run --urls="http://*:5177"

dotnet run --urls="http://*:5726" --ip=127.0.0.1 --port=5726 --weight=1
dotnet run --urls="http://*:5727" --ip=127.0.0.1 --port=5727 --weight=2
dotnet run --urls="http://*:5728" --ip=127.0.0.1 --port=5728 --weight=10
dotnet run --urls="http://*:5729" --ip=127.0.0.1 --port=5729 --weight=15

```

### Route

```c#
[FromQuery]：从Url的查询字符串中获取值。查询字符串就是Url中问号（?）后面拼接的参数
[FromRoute]：从路由数据中获取值。
[FromForm]：从表单中获取值。
[FromBody]：从请求正文中获取值。
[FromHeader]：从请求标头中获取值。
[FromServices]：从DI容器中获取服务。相比其他源，它特殊在值不是来源于HTTP请求，而是DI容器。


public string[] Post([FromQuery] string[] ids)
public string[] Post([FromForm] string[] ids)
	ids=1&ids=2
	ids[0]=1&ids[1]=2
	[0]=1&[1]=2
	ids[a]=1&ids[b]=2&ids.index=a&ids.index=b
	[a]=1&[b]=2&index=a&index=b

public Dictionary<int, string> Post([FromQuery] Dictionary<int, string> idNames)
    idNames[1]=j&idNames[2]=k
    [1]=j&[2]=k
```



### Data Controller-View

Keys: ViewBag、ViewData、TempData、Session

```c#
// Controller
public IActionResult Index()
{
	ViewBag.User1 = "张三";
	ViewData["User2"] = "李四";
	TempData["User3"] = "王五";
	HttpContext.Session.SetString("User4", "赵六");
	object User5 = "田七";
	return View(User5);
}

// View
@{
    ViewData["Title"] = "Index";
}
@model String
<h1>this is First Index</h1>

<h2>User1=@ViewBag.User1</h2>
<h2>User2=@ViewData["User2"]</h2>
<h2>User3=@TempData["User3"]</h2>
<h2>User4=@Context.Session.GetString("User4")</h2>
<h2>User5=@Model</h2>
```

### Filter

Keys: IResourceFilter、IAsyncResourceFilter
```c#
// 资源缓存
// IResourceFilter 执行顺序:
a.CustomResourceFilterAttribute.OnResourceExecuting 
b.控制器的构造函数 - 实例化控制器 
c.执行Action方法 
d.CustomResourceFilterAttribute.OnResourceExecuted
```

Keys: IActionFilter、IAsyncActionFilter
```c#
// Action 方法前后的日志记录
// IActionFilter 执行顺序:
a.执行控制器的构造函数 
b.执行CustomActionFilterAttribute.OnActionExecuting
c.执行Action方法 
d.CustomActionFilterAttribute.OnActionExecuted
```

Keys: IResultFilter、IAsyncResultFilter
```c#
// 结果生成前后扩展: 渲染视图和结果的时候，做结果的统一处理；JSON格式的统一处理
a.CustomResultFilterAttribute.OnResultExecuting 
b.开始渲染生成视图内容
c.CustomResultFilterAttribute.OnResultExecuted
```

Keys: IAlwaysRunResultFilter
```c#
// 响应结果的补充: 对HttpContext.Result赋值后，进行扩展补充
```

Keys: AllowAnonymousAttribute
```c#
// 响应结果的补充
```

Keys: IExceptionFilte、IAsyncExceptionFilter

```c#
// 异常处理
```

Keys: ActionFilterAttribute
```c#
// 包含了 ActionFilter 和 ResultFilter 的多种实现
public class CustomAllActionResultFilterAttribute : ActionFilterAttribute
{

	private readonly ILogger<CustomAllActionResultFilterAttribute> _ILogger;
	public CustomAllActionResultFilterAttribute(ILogger<CustomAllActionResultFilterAttribute> iLogger)
	{
		this._ILogger = iLogger;
	}


	public override void OnActionExecuting(ActionExecutingContext context)
	{
		var para = context.HttpContext.Request.QueryString.Value;
		var controllerName = context.HttpContext.GetRouteValue("controller");
		var actionName = context.HttpContext.GetRouteValue("action");
		_ILogger.LogInformation($"执行{controllerName}控制器--{actionName}方法；参数为：{para}");
	}

	public override void OnActionExecuted(ActionExecutedContext context)
	{
		var result = Newtonsoft.Json.JsonConvert.SerializeObject(context.Result);
		var controllerName = context.HttpContext.GetRouteValue("controller");
		var actionName = context.HttpContext.GetRouteValue("action");
		_ILogger.LogInformation($"执行{controllerName}控制器--{actionName}方法:执行结果为：{result}");
	}

	public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
	{
		var controllerName = context.HttpContext.GetRouteValue("controller");
		var actionName = context.HttpContext.GetRouteValue("action");

		var para = context.HttpContext.Request.QueryString.Value;
		_ILogger.LogInformation($"执行{controllerName}控制器--{actionName}方法；参数为：{para}");

		ActionExecutedContext executedContext = await next.Invoke(); //这句话执行就是去执行Action  

		var result = Newtonsoft.Json.JsonConvert.SerializeObject(executedContext.Result);
		_ILogger.LogInformation($"执行{controllerName}控制器--{actionName}方法:执行结果为：{result}");
	}

	public override void OnResultExecuting(ResultExecutingContext context)
	{
		base.OnResultExecuting(context);
	}

	public override void OnResultExecuted(ResultExecutedContext context)
	{
		base.OnResultExecuted(context);
	}

	public override Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
	{
		return base.OnResultExecutionAsync(context, next);
	}
}
```


Keys: AuthorizeAttribute

```c#
// Config Authentication
builder.Services.AddAuthentication(option =>
{
    //options.RequireAuthenticatedSignIn = false;
    option.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    option.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    option.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    option.DefaultForbidScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    option.DefaultSignOutScheme = CookieAuthenticationDefaults.AuthenticationScheme;
}).AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, option =>
{
    //如果没有找到用户信息--->鉴权失败-->授权失败--->就跳转到指定的  [HttpGet] Action
    option.LoginPath = "/api/user/login";
    option.AccessDeniedPath = "/api/exception/unauthorized";
});

// Config Authorization
builder.Services.AddAuthorization(options =>
{
    // 定义策略
    options.AddPolicy(AuthorizePolicy.UserPolicy, policyBuilder =>
    {
        policyBuilder.RequireRole("Admin");
        policyBuilder.RequireClaim("Account", "Administrator");
        policyBuilder.AddRequirements(new AuthKeyRequirement());

        policyBuilder.RequireAssertion(context =>
        {
            bool pass1 = context.User.HasClaim(c => c.Type == ClaimTypes.Role);
            bool pass2 = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value == "Admin";
            bool pass3 = context.User.Claims.Any(c => c.Type == ClaimTypes.Name);
            bool pass = pass1 && pass2 && pass3;
            return pass;
        });
    });
});
// 策略授权 Requirement 扩展
builder.Services.AddTransient<IAuthorizationHandler, AuthKeyHander>();

app.UseAuthentication(); // 身份验证 中间件 在允许用户访问安全资源之前尝试对用户进行身份验证
app.UseAuthorization();  // 身份授权 中间件 授权用户访问安全资源


```

```c#
public class AuthKeyRequirement : IAuthorizationRequirement
{
	public const string AuthKey = nameof(AuthKey);
}

public class AuthKeyHander : AuthorizationHandler<AuthKeyRequirement>
{
	protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AuthKeyRequirement requirement)
	{

		var httpContext = context.Resource as HttpContext;
		var ss = httpContext.Request.Headers[AuthKeyRequirement.AuthKey];
		var key = ss.ElementAtOrDefault(0);

		if (key == "8888888888888888")
		{
			context.Succeed(requirement); // pass
		}

		return Task.CompletedTask;
	}
}
```

```c#
// 标记策略
[Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Roles = "Admin,User")]
[HttpGet]
public async Task<IActionResult> Query()
{
	IEnumerable<User> users = dbService.UserColl.Find(_ => true).ToEnumerable();
	return await Task.FromResult(Json(users));
}

[Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, Policy = AuthorizePolicy.UserPolicy)]
[HttpGet]
public async Task<IActionResult> Query2()
{
	IEnumerable<User> users = dbService.UserColl.Find(_ => true).ToEnumerable();
	return await Task.FromResult(Json(users));
}

[HttpGet]
public async Task<IActionResult> Login()
{
	//var user = HttpContext.User;
	return await Login(name: "lianggan13", password: "1918");
}

[HttpPost]
public async Task<IActionResult> Login(string name, string password)
{
	IActionResult? result = null;
	if (name == "lianggan13" && password == "1918")
	{
		var claims = new List<Claim>()//鉴别你是谁，相关信息
		{
			new Claim("Userid","1"),
			new Claim(ClaimTypes.Role,"Admin"),
			new Claim(ClaimTypes.Role,"User"),
			new Claim(ClaimTypes.Name,$"{name}--来自于Cookies"),
			new Claim(ClaimTypes.Email,$"18672713698@163.com"),
			new Claim("password",password),//可以写入任意数据
			new Claim("Account","Administrator"),
			new Claim("role","admin"),
			new Claim("QQ","1030499676"),
			//new Claim("AuthKey","8888888888888888")
		};
		ClaimsPrincipal userPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims, "Customer"));
		HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, userPrincipal, new AuthenticationProperties
		{
			ExpiresUtc = DateTime.UtcNow.AddMinutes(3),//过期时间：30分钟
		}).Wait();
		result = RedirectToAction(nameof(Query));
	}
	else
	{
		result = RedirectToAction(nameof(Login));
	}

	return await Task.FromResult(result);
}
```

Keys: lifetime

```c#
a.验证权限，进入到Authorization 
b.ResourceFilter 中的 - OnResourceExecuting 
c.开始创建控制器实例 
d.ActionFilter 中的 - OnActionExecuting 
e.执行Action方法 
f.ActionFilter 中的 - OnActionExecuted 
g.ResultFilter 中的 - OnResultExecuting 
h.AlwaysRunResultFilter 中的 - OnResultExecuting 
i.渲染视图 
j.AlwaysRunResultFilter 中的 - OnResultExecuted 
k.ResultFilter 中的 - OnResultExecuted 
l.ResourceFilter中的 - OnResourceExecuted
```

Keys: JWT Authorize

```
Jwt授权-颁发Token
https://jwt.io/
```

### Middleware

```
RequestDelegate 委托
delegate Task RequestDelegate(HttpContext context)
每个中间件在构建后就是一个 RequestDelegate 委托对象

终点中间件
整个中间件流水线后的最后一个中间件
使用 ApplicationBuilder.Run 注册

中间件做决策
IApplicationBuilder.Map
IApplicationBuilder.MapWhen
```

### ServiceCollection

Keys: AddSingleton、AddTransient、AddScoped、BuildServiceProvider、GetService

```c#
AddSingleton：单例生命周期：同一个类型，创建出来的是同一个实例
AddTransient：瞬时生命周期,每一次创建都是是一个全新的实例
AddScoped：作用域生命周期： 同一个serviceProvider获取到的是同一个实例
```

### Autofac

Keys: ContainerBuilder、RegisterType、RegisterInstance、Register

```c#
//注册抽象和具体普通类 RegisterType
{
	ContainerBuilder containerBuilder = new ContainerBuilder();
	containerBuilder.RegisterType<Microphone>().As<IMicrophone>();
	IContainer container = containerBuilder.Build();
	IMicrophone microphone = container.Resolve<IMicrophone>();
}

//注册一个具体的实例 RegisterInstance
{
	ContainerBuilder containerBuilder = new ContainerBuilder();
	containerBuilder.RegisterInstance(new Microphone());
	IContainer container = containerBuilder.Build();
	IMicrophone microphone = container.Resolve<Microphone>();
}

{
	////注册一段业务逻辑 Register
	ContainerBuilder containerBuilder = new ContainerBuilder();
	containerBuilder.RegisterType<Microphone>().As<IMicrophone>();
	containerBuilder.Register<IPower>(context =>
	{
		//这里的业务逻辑负责创建出IPower 的实例---可以给一个入口，我们自己来创建对象的实例
		IMicrophone microphone = context.Resolve<IMicrophone>();
		IPower power = new Power(microphone);

		return power;
	});
	IContainer container = containerBuilder.Build();
	IPower power = container.Resolve<IPower>();
}

//注册泛型 RegisterGeneric
{
	ContainerBuilder containerBuilder = new ContainerBuilder();
	containerBuilder.RegisterGeneric(typeof(List<>)).As(typeof(IList<>));
	containerBuilder.RegisterType<Microphone>().As<IMicrophone>();
	IContainer container = containerBuilder.Build();
	IList<IMicrophone> microphonelist = container.Resolve<IList<IMicrophone>>();
}

//注册程序集 RegisterAssemblyTypes
{
	ContainerBuilder containerBuilder = new ContainerBuilder();
	Assembly interfaceAssembly = Assembly.LoadFrom("Advanced.NET6.Business.Interfaces.dll");
	Assembly serviceAssembly = Assembly.LoadFrom("Advanced.NET6.Business.Services.dll");
	containerBuilder.RegisterAssemblyTypes(interfaceAssembly, serviceAssembly).AsImplementedInterfaces();
	IContainer container = containerBuilder.Build();
	IEnumerable<IMicrophone> microphonelist = container.Resolve<IEnumerable<IMicrophone>>();
}
```

Keys: UsingConstructor、PropertiesAutowired、PropertySelector、OnActivated

```c#
//如果有多个构造函数，默认选择构造函数参数最多构造函数了
//如果希望选择其中只有一个构造函数参数的构造函数 UsingConstructor
{
	ContainerBuilder containerBuilder = new ContainerBuilder();
	containerBuilder.RegisterType<Microphone>()
		.As<IMicrophone>();
	containerBuilder.RegisterType<Power>()
		 .UsingConstructor(typeof(IMicrophone), typeof(IMicrophone)) //选择类型为IMicrophone 且参数的数量只有一个的构造函数
		.As<IPower>();
	IContainer container = containerBuilder.Build();
	IPower power = container.Resolve<IPower>();
}

//属性注入 PropertiesAutowired
{
	ContainerBuilder containerBuilder = new ContainerBuilder();
	containerBuilder.RegisterType<Microphone>().As<IMicrophone>();
	containerBuilder.RegisterType<Power>().As<IPower>();
	containerBuilder.RegisterType<Headphone>().As<IHeadphone>();
	containerBuilder.RegisterType<ApplePhone>().As<IPhone>()
		.PropertiesAutowired(); //表示要支持属性注入： 在对象创建出来以后，自动给属性创建实例，赋值上去

	IContainer container = containerBuilder.Build();
	IPhone iPhone = container.Resolve<IPhone>();
}

//属性注入--支持 PropertySelector
{
	ContainerBuilder containerBuilder = new ContainerBuilder();
	containerBuilder.RegisterType<Microphone>().As<IMicrophone>();
	containerBuilder.RegisterType<Power>().As<IPower>();
	containerBuilder.RegisterType<Headphone>().As<IHeadphone>();
	containerBuilder.RegisterType<ApplePhone>().As<IPhone>()
		.PropertiesAutowired(new CusotmPropertySelector()); //表示要支持属性注入： 在对象创建出来以后，自动给属性创建实例，赋值上去

	IContainer container = containerBuilder.Build();
	IPhone iPhone = container.Resolve<IPhone>();
}

//方法注入 OnActivated
{
	ContainerBuilder containerBuilder = new ContainerBuilder();
	containerBuilder.RegisterType<Microphone>().As<IMicrophone>();
	containerBuilder.RegisterType<Power>().As<IPower>();
	containerBuilder.RegisterType<Headphone>().As<IHeadphone>();
	containerBuilder.RegisterType<ApplePhone>().As<IPhone>()
		.OnActivated(activa =>
		{
			IPower power = activa.Context.Resolve<IPower>();
			activa.Instance.Init123456678890(power);
		});

	IContainer container = containerBuilder.Build();
	IPhone iPhone = container.Resolve<IPhone>();
}
```

Keys: Keyed、ResolveKeyed

```c#
//单抽象多实现
//1.默认创建出的对象是后面注册的这个Service Keyed
//2.需要在注册的时候，给定一个标识，然后在获取的时候，也把标识指定，就会按照标识来匹配创建对象
{
	ContainerBuilder containerBuilder = new ContainerBuilder();
	//containerBuilder.RegisterType<Microphone>().As<IMicrophone>();
	//containerBuilder.RegisterType<MicrophoneNew>().As<IMicrophone>();

	containerBuilder.RegisterType<Microphone>().Keyed<IMicrophone>("Microphone");
	containerBuilder.RegisterType<MicrophoneNew>().Keyed<IMicrophone>("MicrophoneNew");

	IContainer container = containerBuilder.Build();
	//IMicrophone microphone = container.Resolve<IMicrophone>();
	IEnumerable<IMicrophone> microphonelist = container.Resolve<IEnumerable<IMicrophone>>();

	IMicrophone microphone2 = container.ResolveKeyed<IMicrophone>("Microphone");
	IMicrophone microphone3 = container.ResolveKeyed<IMicrophone>("MicrophoneNew");
}
```

Keys: AOP

```c#
// NutGet: Autofac、Castle.Core、Autofac.Extras.DynamicProx
//2.扩展一个IInterceptor 实现方法
//3.注册对象和具体之间的关系的时候，需要执行要支持AOP扩展EnableClassInterceptors
//4.把要扩展aop的方法定义为  virtual 方法
//5.把扩展的IInterceptor 也要注册到容器中去


//一、通过EnableClassInterceptors 来支持的时候
//1.需要把 Intercept标记到具体的而实现类上--扩展IInterceptor也要引用进来
//2.特点：必须要是虚方法才会进入到  扩展IInterceptor 来---才能支持aop扩展


//二、通过EnableInterfaceInterceptors来支持的时候
//1.需要把 Intercept标记到抽象--接口--扩展IInterceptor也要引用到抽象这
//2.特点：只要是实现了这接口，无论是否是虚方法，都可以进入到IInterceptor 中来，也就是都可以支持AOP扩展
```







### Nancy

Keys:Get、AddUrlSegment、dynamic

```c#
// Get Request
private const string Path = "/api/position/confirm/{positionId}/{command}/{no}/{msg}";
protected override RestRequest CreateRequest()
{
    RestRequest request = base.CreateRequest();
    request.Timeout = 5000;
    request.Method = Method.GET;
    request.AddUrlSegment("positionId", positionId);
    request.AddUrlSegment("command", command);
    request.AddUrlSegment("no", no);
    request.AddUrlSegment("msg", msg);
    return request;
}

// Get Response
private Response PositionAlgorithmConfirm(dynamic parameters)
{
    int positionId = parameters.positionId;
    int no = parameters.no;
    int command = parameters.command;
    string msg = parameters.Msg;

    return ResponseData.Success(success).ToString();
}
```



Keys: Post、AddParameter、Request.Form、Request.Body、JObject

```c#
// Post Request key-value
private const string Path ="/api/position/confirm/algorithm";
protected override RestRequest CreateRequest()
{
    RestRequest request = base.CreateRequest();
    request.Timeout = 6000;
    request.Method = Method.POST;
    request.AddParameter("positionId", positionId);
    request.AddParameter("command", command);
    request.AddParameter("no", no);
    request.AddParameter("msg", msg);

    return request;
}

// Post Response key-value
private Response PosAlgorithmConfirm(dynamic _)
{
    int positionId = int.Parse(GetForm("positionId"));
    //int no = int.Parse(GetForm("no"));
    int command = int.Parse(GetForm("command"));
    string msg = GetForm("msg");
 
    return ResponseData.Success().ToString();
}

private string GetForm(string key)
{
    if (!Request.Form.ContainsKey(key))
    {
        throw new ParameterIsNullOrMissingException(key);
    }
    return Request.Form.ToDictionary()[key];
}

// Post Request json object
private const string Path = "/api/position/issue/user";
protected override RestRequest CreateRequest()
{
    RestRequest request = base.CreateRequest();
    request.Method = Method.POST;
    request.AddParameter("application/json",Newtonsoft.Json.JsonConvert.SerializeObject(obj), ParameterType.RequestBody);
    return request;
}

private const string Path = "/KeyServer/app/toolsUser/save/batch";
protected override RestRequest CreateRequest()
{
    RestRequest request = base.CreateRequest();
    request.Method = Method.POST;
    request.AddHeader("Content-Type", "application/json;charset=UTF-8");
    //toolsId
    request.AddJsonBody(toolUsers);
    return request;
}


public static ResponseData AddOrUpdateUser(User user)
{
    const string apiUrl = "api/user/upsert";
    var restClent = CreateRestClient();
    var request = new RestRequest(apiUrl, Method.POST)
    {
        //Timeout = 10 * 1000
    };
    var json = JObject.FromObject(user);
    json.Add("Photo", user.Photo);          // add Photo property
    json["NewPassword"] = user.Password;    // set NewPassword property
    request.AddParameter("application/json", json, ParameterType.RequestBody);

    var response = restClent.Execute(request);
    var responseData = JsonConvert.DeserializeObject<ResponseData>(response.Content);
    return responseData;
}

// Post Response json object
private Response PositionIssueUser(dynamic _)
{
    PositionIssueUsersParams obj = GetContent<PositionIssueUsersParams>();
    return ResponseData.Success().ToString();
}

private T GetContent<T>(Encoding encoding = Encoding.UTF8)
{
    byte[] data = new byte[Request.Body.Length];
    Request.Body.Read(data, 0, data.Length);
    var json = encoding.GetString(data);
    return Newtonsoft.Json.JsonConvert.DeserializeObject<T>(json);
}
```



### ReverseProxy

```C#
Asp.Net Core 反向代理
包: Yarp.ReverseProxy

"ReverseProxy": {
	"Routes": {
	  "InterlockRoute": {
		"ClusterId": "InterlockCluster",
		"Match": {
		  "Path": "/Interlock/{**remainder}"
		},
		"Transforms": [
		  { "PathRemovePrefix": "/Interlock" },
		  {
			"RequestHeader": "AuthKey",
			"Set": "6666666666666666"
		  }
		]
	  }
	},
	"Clusters": {
	  "InterlockCluster": {
		"Destinations": {
		  "Interlock": {
			"Address": "http://192.168.1.102:8080/"
		  }
		}
	  }
	}
},

builder.Services.AddReverseProxy()
.LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

app.MapReverseProxy();
```

### ORM

Nuget: SqlSugarCore



### Log4Net

```
log4Net.AspNetCore
Microsoft.Extensions.Logging.Log4Net.AspNetCore
http://logging.apache.org/log4net/release/config-examples.html
Net Core IIS下无Log4Net日志输出，命令行下却有（dotnet运行）：
https://www.cnblogs.com/liushen/p/Findout_Why_IIS_Has_Not_Log_But_Console_Has.html
```

### Deploy IIS

```
way1: 直接通过文件夹 发布

way2: 使用 WebDeploy，并 通过 VS 实现无差异化发布
启用 IIS 管理服务
Web Platform Installer
Web Deploy 3.6

发布 Web 服务器(IIS)
Web 部署
```









### Experience

+ 解决跨域问题

```c#
跨域问题其实是浏览器所限定的； 
同源策略 是由NetScape提出的一个著名的安全策略。所谓的同源，指的是协议，域名， 端口相同。浏览器处于安全方面的考虑，只允许本域名下的接口交互，不同源的客户端脚 本，在没有明确授权的情况下，浏览器认为这个资源不安全，不能用。

// way 1.通过添加 Header 
HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*"); 
public class CustomCorsActionFilterAttribute : Attribute, IActionFilter
{

	public void OnActionExecuting(ActionExecutingContext context)
	{
		context.HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*"); 
	}

	public void OnActionExecuted(ActionExecutedContext context)
	{
	   
	}
}

// way 2.通过添加 Cores
builder.Services.AddCors(policy =>
{
    policy.AddPolicy("CorsPolicy", opt => opt
    .AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod()
    .WithExposedHeaders("X-Pagination"));
});

app.UseCors("CorsPolicy");
```

+ applicationUrl 配置

```
"applicationUrl": "http://0.0.0.0:8081",
"applicationUrl": "http://localhost:8081",

localhost是127.0.0.1的别名，只允许本机自己访问自己。
0.0.0.0的话，允许其它机器访问自己
```

