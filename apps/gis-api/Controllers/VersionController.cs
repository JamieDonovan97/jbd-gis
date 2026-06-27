using Microsoft.AspNetCore.Mvc;

namespace GisApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VersionController : ControllerBase
{
    // Version is stamped by Nerdbank.GitVersioning from the root version.json +
    // git height; ThisAssembly is generated at build time. The web is stamped from
    // the same source, so the two report the same build.
    [HttpGet]
    public IActionResult Get() =>
        Ok(new
        {
            version = ThisAssembly.AssemblyInformationalVersion,
            commit = ThisAssembly.GitCommitId,
        });
}
