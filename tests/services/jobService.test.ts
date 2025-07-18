/**
 * @jest-environment node
 */
import { jobService } from '../../src/services/jobService';

describe('Job Service', () => {
  it('should simulate posting a job', async () => {
    const result = await jobService.postJob({ title: 'New Cook Job' });
    expect(result).toHaveProperty('jobId');
    expect(result.jobId).toBe('mock-job-id');
  });

  it('should simulate applying for a job', async () => {
    const result = await jobService.applyForJob({ jobId: 'mock-job-id' });
    expect(result).toHaveProperty('applicationId');
    expect(result.applicationId).toBe('mock-application-id');
  });
});
