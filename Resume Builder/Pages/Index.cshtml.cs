using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SelectPdf;

namespace Resume_Builder.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }

        public IActionResult OnPostExportPdf([FromBody] string data)
        {
            HtmlToPdf converter = new HtmlToPdf();
            converter.Options.MarginTop = 50;
            converter.Options.MarginBottom = 50;
            converter.Options.MarginLeft = 50;
            converter.Options.MarginRight = 50;

            PdfDocument pdfDoc = converter.ConvertHtmlString(data);

            var pdfStream = new System.IO.MemoryStream();
            pdfDoc.Save(pdfStream);
            pdfDoc.Close();
            pdfStream.Position = 0;

            return File(pdfStream, "application/pdf", "generated.pdf");
        }
    }
}
