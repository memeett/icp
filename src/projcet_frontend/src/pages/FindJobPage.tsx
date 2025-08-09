import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Pagination, 
  Empty,
  Spin,
  Drawer,
  Checkbox,
  Slider,
  Select,
  Typography
} from 'antd';
import { 
  FilterOutlined, 
  AppstoreOutlined, 
  UnorderedListOutlined,
  SortAscendingOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Navbar, SearchBar, JobCard } from '../ui/components';
import { useJobs } from '../shared/hooks/useJobs';
import { useDebouncedSearch } from '../shared/hooks/useDebounce';
import { useLocalStorage } from '../shared/hooks/useLocalStorage';

const { Title, Text } = Typography;
const { Option } = Select;

// Price range options
const PRICE_RANGES = [
  { label: "Under $100", value: "0-100", min: 0, max: 100 },
  { label: "$100 - $500", value: "100-500", min: 100, max: 500 },
  { label: "$500 - $1000", value: "500-1000", min: 500, max: 1000 },
  { label: "$1000 - $2000", value: "1000-2000", min: 1000, max: 2000 },
  { label: "$2000+", value: "2000+", min: 2000, max: Infinity },
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Highest Pay', value: 'salary_high' },
  { label: 'Lowest Pay', value: 'salary_low' },
  { label: 'Deadline Soon', value: 'deadline' },
];

const FindJobPage: React.FC = memo(() => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useLocalStorage<'grid' | 'list'>('job-view-mode', 'grid');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState('newest');
  
  const {
    jobs,
    jobCategories,
    filteredJobs,
    paginatedJobs,
    currentPage,
    setCurrentPage,
    setSearchQuery,
    updateFilters,
    isLoading
  } = useJobs();

  const { searchValue, debouncedSearchValue, setSearchValue } = useDebouncedSearch('', 300);

  // Update search query when debounced value changes
  useEffect(() => {
    setSearchQuery(debouncedSearchValue);
  }, [debouncedSearchValue, setSearchQuery]);

  // Update filters when local state changes
  useEffect(() => {
    updateFilters({
      categories: selectedCategories,
      priceRanges: selectedPriceRanges,
      sortBy
    });
  }, [selectedCategories, selectedPriceRanges, sortBy, updateFilters]);

  // Memoized filter handlers
  const handleCategoryChange = useCallback((checkedValues: string[]) => {
    setSelectedCategories(checkedValues);
  }, []);

  const handlePriceRangeChange = useCallback((checkedValues: string[]) => {
    setSelectedPriceRanges(checkedValues);
  }, []);

  const handleSalaryRangeChange = useCallback((value: number | number[]) => {
    if (Array.isArray(value) && value.length === 2) {
      setSalaryRange([value[0], value[1]]);
    }
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  const toggleFilters = useCallback(() => {
    setFiltersVisible(prev => !prev);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSalaryRange([0, 5000]);
    setSortBy('newest');
  }, []);

  // Memoized filter content
  const filterContent = useMemo(() => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <Title level={5} className="mb-3">Job Categories</Title>
        <Checkbox.Group
          value={selectedCategories}
          onChange={handleCategoryChange}
          className="flex flex-col space-y-2"
        >
          {jobCategories.map(category => (
            <Checkbox key={category.id} value={category.jobCategoryName}>
              {category.jobCategoryName}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>

      {/* Price Ranges */}
      <div>
        <Title level={5} className="mb-3">Budget Range</Title>
        <Checkbox.Group
          value={selectedPriceRanges}
          onChange={handlePriceRangeChange}
          className="flex flex-col space-y-2"
        >
          {PRICE_RANGES.map(range => (
            <Checkbox key={range.value} value={range.value}>
              {range.label}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>

      {/* Salary Slider */}
      <div>
        <Title level={5} className="mb-3">
          Salary Range: ${salaryRange[0]} - ${salaryRange[1]}
        </Title>
        <Slider
          range
          min={0}
          max={5000}
          step={100}
          value={salaryRange}
          onChange={handleSalaryRangeChange}
          tooltip={{ formatter: (value) => `$${value}` }}
        />
      </div>

      {/* Clear Filters */}
      <Button block onClick={clearFilters}>
        Clear All Filters
      </Button>
    </div>
  ), [
    jobCategories,
    selectedCategories,
    selectedPriceRanges,
    salaryRange,
    handleCategoryChange,
    handlePriceRangeChange,
    handleSalaryRangeChange,
    clearFilters
  ]);

  // Memoized job grid
  const jobGrid = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip="Loading jobs..." />
        </div>
      );
    }

    if (paginatedJobs.length === 0) {
      return (
        <Empty
          description="No jobs found matching your criteria"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="py-20"
        >
          <Button type="primary" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Empty>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${currentPage}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Row gutter={[16, 16]}>
            {paginatedJobs.map((job, index) => (
              <Col
                key={job.id}
                xs={24}
                sm={viewMode === 'grid' ? 12 : 24}
                lg={viewMode === 'grid' ? 8 : 24}
                xl={viewMode === 'grid' ? 6 : 24}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <JobCard
                    job={job}
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                  />
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </AnimatePresence>
    );
  }, [isLoading, paginatedJobs, viewMode, currentPage, clearFilters]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Title level={2} className="mb-4">Find Your Perfect Job</Title>
          <SearchBar
            placeholder="Search jobs, skills, companies..."
            onSearch={setSearchValue}
            onFilterClick={toggleFilters}
            className="mb-6"
          />
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-between mb-6 gap-4"
        >
          <div className="flex items-center space-x-4">
            <Text type="secondary">
              {filteredJobs.length} jobs found
            </Text>
            {(selectedCategories.length > 0 || selectedPriceRanges.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map(category => (
                  <Tag
                    key={category}
                    closable
                    onClose={() => handleCategoryChange(
                      selectedCategories.filter(c => c !== category)
                    )}
                  >
                    {category}
                  </Tag>
                ))}
                {selectedPriceRanges.map(range => (
                  <Tag
                    key={range}
                    closable
                    onClose={() => handlePriceRangeChange(
                      selectedPriceRanges.filter(r => r !== range)
                    )}
                  >
                    {PRICE_RANGES.find(p => p.value === range)?.label}
                  </Tag>
                ))}
              </div>
            )}
          </div>

          <Space>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              style={{ width: 150 }}
              suffixIcon={<SortAscendingOutlined />}
            >
              {SORT_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>

            <Button.Group>
              <Button
                type={viewMode === 'grid' ? 'primary' : 'default'}
                icon={<AppstoreOutlined />}
                onClick={() => setViewMode('grid')}
              />
              <Button
                type={viewMode === 'list' ? 'primary' : 'default'}
                icon={<UnorderedListOutlined />}
                onClick={() => setViewMode('list')}
              />
            </Button.Group>

            <Button
              icon={<FilterOutlined />}
              onClick={toggleFilters}
              className="md:hidden"
            >
              Filters
            </Button>
          </Space>
        </motion.div>

        {/* Main Content */}
        <Row gutter={24}>
          {/* Desktop Filters */}
          <Col xs={0} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card title="Filters" className="sticky">
                {filterContent}
              </Card>
            </motion.div>
          </Col>

          {/* Job Listings */}
          <Col xs={24} md={18}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {jobGrid}

              {/* Pagination */}
              {paginatedJobs.length > 0 && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    current={currentPage}
                    total={filteredJobs.length}
                    pageSize={12}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} jobs`
                    }
                  />
                </div>
              )}
            </motion.div>
          </Col>
        </Row>

        {/* Mobile Filters Drawer */}
        <Drawer
          title="Filters"
          placement="right"
          onClose={() => setFiltersVisible(false)}
          open={filtersVisible}
          width={300}
          className="md:hidden"
        >
          {filterContent}
        </Drawer>
      </div>
    </div>
  );
});

FindJobPage.displayName = 'FindJobPage';

export default FindJobPage;