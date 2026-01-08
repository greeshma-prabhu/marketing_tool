#!/usr/bin/env python3
"""CLI script for generating onepagers."""
import sys
import argparse
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from core.normalizer import normalize_csv
from core.copy_generator import generate_copy
from core.renderer import render_pdf
from core.qc_engine import check_quality
from templates.template_01_minimal import Template01Minimal
from config.settings import settings
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.panel import Panel

console = Console()


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(description="Generate onepager from CSV input")
    parser.add_argument("--input", "-i", required=True, help="Input CSV file path")
    parser.add_argument("--output", "-o", default="./data/outputs", help="Output directory")
    parser.add_argument("--template", "-t", default="template_01", help="Template ID")
    parser.add_argument("--language", "-l", default=None, help="Language code (overrides CSV)")
    parser.add_argument("--skip-qc", action="store_true", help="Skip quality control")
    
    args = parser.parse_args()
    
    # Validate input file
    input_path = Path(args.input)
    if not input_path.exists():
        console.print(f"[red]Error: Input file not found: {input_path}[/red]")
        sys.exit(1)
    
    # Create output directory
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    console.print(Panel.fit("[bold blue]Onepager Generation Agent[/bold blue]", border_style="blue"))
    
    # Step 1: Normalize input
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console
    ) as progress:
        task = progress.add_task("Normalizing input...", total=None)
        try:
            briefs = normalize_csv(input_path)
            progress.update(task, description=f"✓ Normalized {len(briefs)} product(s)")
        except Exception as e:
            console.print(f"[red]Error normalizing input: {e}[/red]")
            sys.exit(1)
    
    # Process each product
    for idx, brief in enumerate(briefs, 1):
        console.print(f"\n[bold]Processing product {idx}/{len(briefs)}: {brief.name}[/bold]")
        
        # Override language if specified
        if args.language:
            brief.language = args.language
        
        # Step 2: Select template
        template = Template01Minimal()  # For MVP, only one template
        
        # Step 3: Generate copy
        with console.status("[bold green]Generating copy with Gemini...") as status:
            try:
                slot_limits = template.get_slot_limits()
                copy = generate_copy(brief, slot_limits)
                console.print("[green]✓ Copy generated[/green]")
            except Exception as e:
                console.print(f"[red]Error generating copy: {e}[/red]")
                console.print(f"[yellow]Hint: Make sure GOOGLE_API_KEY is set in .env file[/yellow]")
                sys.exit(1)
        
        # Step 4: Quality control
        if not args.skip_qc:
            with console.status("[bold yellow]Running quality control...") as status:
                qc_result = check_quality(template, copy)
                
                if qc_result.overall_status == "fail":
                    console.print("[red]✗ QC Failed[/red]")
                    for check in qc_result.checks:
                        if check.status == "fail":
                            console.print(f"  [red]- {check.message}[/red]")
                    console.print("[yellow]Continuing anyway...[/yellow]")
                elif qc_result.overall_status == "warning":
                    console.print("[yellow]⚠ QC Warnings[/yellow]")
                    for check in qc_result.checks:
                        if check.status == "warning":
                            console.print(f"  [yellow]- {check.message}[/yellow]")
                else:
                    console.print("[green]✓ QC Passed[/green]")
        
        # Step 5: Render PDF
        with console.status("[bold blue]Rendering PDF...") as status:
            try:
                output_filename = f"{brief.product_id}_{template.template_id}_{brief.language}.pdf"
                output_path = output_dir / output_filename
                
                render_pdf(template, copy, brief.name, str(output_path))
                console.print(f"[green]✓ PDF generated: {output_path}[/green]")
            except Exception as e:
                console.print(f"[red]Error rendering PDF: {e}[/red]")
                sys.exit(1)
    
    console.print(f"\n[bold green]✓ Successfully generated {len(briefs)} onepager(s)![/bold green]")


if __name__ == "__main__":
    main()

