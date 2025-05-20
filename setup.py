from setuptools import setup, find_packages

setup(
    name="ai_dropship_backend",
    version="1.0.1",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn[standard]",
        "sqlalchemy",
        "pydantic[email]",
        "python-dotenv",
        "httpx",
        "playwright",
        "greenlet",
        "pymysql",
        "requests>=2.31.0",
        "stripe",
    ],
    python_requires=">=3.8",
)
