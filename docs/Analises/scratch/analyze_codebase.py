import os
import json
import subprocess
from pathlib import Path

ROOT = Path(r"F:\ProjetosMPT\denuncias\cidadania-canal-denuncias")

def analyze_sloc():
    extensions = {
        '.ts': 'TypeScript',
        '.js': 'JavaScript',
        '.mjs': 'JavaScript (ESM)',
        '.html': 'HTML',
        '.css': 'CSS',
        '.scss': 'SCSS',
        '.json': 'JSON'
    }
    
    ignore_dirs = {'node_modules', 'dist', '.angular', 'playwright-report', 'test-results', '.git', '.vscode'}
    ignore_files = {'package-lock.json'}
    
    stats = {}
    
    for dirpath, dirnames, filenames in os.walk(ROOT):
        # Filter directories in place
        dirnames[:] = [d for d in dirnames if d not in ignore_dirs]
        
        for f in filenames:
            if f in ignore_files:
                continue
            ext = Path(f).suffix.lower()
            if ext in extensions:
                lang = extensions[ext]
                filepath = Path(dirpath) / f
                rel_path = str(filepath.relative_to(ROOT))
                
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as fp:
                        lines = fp.readlines()
                        total_lines = len(lines)
                        source_lines = 0
                        comment_lines = 0
                        blank_lines = 0
                        
                        in_block_comment = False
                        for line in lines:
                            stripped = line.strip()
                            if not stripped:
                                blank_lines += 1
                                continue
                            
                            if ext in ['.ts', '.js', '.mjs', '.css', '.scss']:
                                if stripped.startswith('/*') and stripped.endswith('*/') and len(stripped) > 4:
                                    comment_lines += 1
                                elif stripped.startswith('/*'):
                                    in_block_comment = True
                                    comment_lines += 1
                                elif in_block_comment:
                                    comment_lines += 1
                                    if '*/' in stripped:
                                        in_block_comment = False
                                elif stripped.startswith('//'):
                                    comment_lines += 1
                                else:
                                    source_lines += 1
                            elif ext == '.html':
                                if stripped.startswith('<!--') and stripped.endswith('-->'):
                                    comment_lines += 1
                                else:
                                    source_lines += 1
                            else:
                                source_lines += 1
                                
                        if lang not in stats:
                            stats[lang] = {
                                'files': 0,
                                'total_lines': 0,
                                'source_lines': 0,
                                'comment_lines': 0,
                                'blank_lines': 0
                            }
                        stats[lang]['files'] += 1
                        stats[lang]['total_lines'] += total_lines
                        stats[lang]['source_lines'] += source_lines
                        stats[lang]['comment_lines'] += comment_lines
                        stats[lang]['blank_lines'] += blank_lines
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")

    return stats

def main():
    print("=== QUANTITATIVE METRICS ANALYSIS ===")
    stats = analyze_sloc()
    print(json.dumps(stats, indent=2))
    
    with open(r"F:\ProjetosMPT\denuncias\Analises\scratch\sloc_stats.json", "w", encoding="utf-8") as f:
        json.dump(stats, f, indent=2)

if __name__ == "__main__":
    main()
