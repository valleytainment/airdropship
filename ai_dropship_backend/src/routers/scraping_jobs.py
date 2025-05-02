# API Router for Scraping Jobs

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

# Adjust import path based on actual project structure
from src import schemas, main as db_main
from src.services import scraper_service

router = APIRouter(
    prefix="/scraping-jobs",
    tags=["scraping"],
    responses={404: {"description": "Not found"}},
)

# Dependency to get DB session
def get_db():
    db = db_main.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.ScrapingJob, status_code=status.HTTP_202_ACCEPTED)
def create_scraping_job(job: schemas.ScrapingJobCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Creates a new scraping job and schedules it to run in the background."""
    db_job = db_main.ScrapingJob(
        job_type=job.job_type,
        supplier_id=job.supplier_id,
        status="pending"
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    # Schedule the job execution
    background_tasks.add_task(scraper_service.run_scraping_job, db_job.id, db)

    return db_job

@router.get("/", response_model=List[schemas.ScrapingJob])
def read_scraping_jobs(skip: int = 0, limit: int = 100, status: str | None = None, db: Session = Depends(get_db)):
    """Retrieves a list of scraping jobs, optionally filtered by status."""
    query = db.query(db_main.ScrapingJob).order_by(db_main.ScrapingJob.created_at.desc())
    if status:
        query = query.filter(db_main.ScrapingJob.status == status)
    jobs = query.offset(skip).limit(limit).all()
    return jobs

@router.get("/{job_id}", response_model=schemas.ScrapingJob)
def read_scraping_job(job_id: int, db: Session = Depends(get_db)):
    """Retrieves details of a specific scraping job."""
    db_job = db.query(db_main.ScrapingJob).filter(db_main.ScrapingJob.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Scraping job not found")
    return db_job

