
import React, {useState} from 'react';
import { Search, MapPin, Flag, CalendarDays, Users } from 'lucide-react';
import dummyInitiatives from '../../data/initiatives';

const NearbyInitiatives = () => {

    const [priorityFilter, setPriorityFilter] = useState('All');
  const [distanceFilter, setDistanceFilter] = useState(null);

  const parseDistance = (distanceStr) => {
    const match = distanceStr.match(/([\d.]+)\s*km/);
    return match ? parseFloat(match[1]) : null;
  };

  const filteredInitiatives = dummyInitiatives.filter((initiative) => {
    const priorityMatch =
      priorityFilter === 'All' || initiative.priority.toLowerCase().includes(priorityFilter.toLowerCase());

    const distanceValue = parseDistance(initiative.distance);
    const distanceMatch =
      !distanceFilter || (distanceValue && distanceValue <= distanceFilter);

    return priorityMatch && distanceMatch;
  });

  const filterButtonClass = (isActive) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-allBlack text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`;

  const Button = ({ children, className, onClick, type = 'button', disabled = false, ariaLabel, id, dataTestId }) => {
    return (
      <button
        type={type}
        className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 ${className}`}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        id={id}
        data-testid={dataTestId}
      >
        {children}
      </button>
    );
  };

  const MainButton = ({ children, className, onClick, type = 'button', disabled = false, ariaLabel, id, dataTestId, icon: IconComponent, iconPosition = 'left' }) => {
    return (
      <button
        type={type}
        className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 ${className}`}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        id={id}
        data-testid={dataTestId}
      >
        {IconComponent && iconPosition === 'left' && <IconComponent size={16} />}
        {children}
        {IconComponent && iconPosition === 'right' && <IconComponent size={16} />}
      </button>
    );
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="flex items-center mb-8 ">
        <div className="bg-red-500 w-6 h-6 rounded-full mr-2"></div>
        <span className="text-lg font-semibold text-gray-800">Logoipsum</span>
      </header>

      <main className=" mx-auto ">
        <h1 className="text-2xl font-popSmBld text-allBlack mb-2">Nearby community initiatives</h1>
        <p className="font-popReg text-allGray mb-6">
          Based on your latitude and longitude (0.773328, 3236490) 
        </p>

        <div className="flex items-center bg-white border border-gray-300 rounded-md p-2 mb-6 ">
          <Search size={20} className="text-gray-500  mr-2" />
          <input
            type="text"
            placeholder="Search bar"
            className="flex-1 outline-none text-allGray font-popReg"
            aria-label="Search community initiatives"
          />
        </div>

        <div className="flex space-x-12 mb-8 ">
            <div className='flex items-center space-x-2'>
                <span className="block  font-popReg text-allBlack">Priority:</span>
                <div className="flex space-x-2">
                    {['All', 'High', 'Medium', 'Low'].map((level) => (
                    <button
                        key={level}
                        className={filterButtonClass(priorityFilter === level)}
                        onClick={() => setPriorityFilter(level)}
                    >
                        {level}
                    </button>
                    ))}
                </div>
            </div>


            {/* Distance Filter */}
            <div className='flex items-center space-x-2'>
                <span className="block font-popReg text-allBlack">Distance:</span>
                <div className="flex space-x-3">
                    {['All', 0.5, 1, 2].map((km) => (
                    <button
                        key={km}
                        className={filterButtonClass(
                        (km === 'All' && distanceFilter === null) || distanceFilter === km
                        )}
                        onClick={() => setDistanceFilter(km === 'All' ? null : km)}
                    >
                        {km === 'All' ? 'All' : `${km} km`}
                    </button>
                    ))}
                </div>
            </div>
        </div>

        <p className="text-allGray font-popReg mb-6">{filteredInitiatives.length} initiative found from the area you analyzed</p>

        {filteredInitiatives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredInitiatives.map((initiative) => (
                <div key={initiative.id} className="bg-white rounded-lg md p-6 border border-gray-200">
                    <div className="flex items-start mb-4">
                    <MapPin size={18} className="text-allGray mr-3" />
                    <div>
                        <p className="font-popReg text-sm text-allGray">{initiative.distance}</p>
                        <h2 className="text-xl font-popSmBld text-allBlack mt-1">{initiative.name}</h2>
                        <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-popMd mt-2
                            ${initiative.priority === 'High priority' ? 'bg-red-100 text-red-700' : ''}
                            ${initiative.priority === 'Medium priority' ? 'bg-orange-100 text-orange-700' : ''}
                            ${initiative.priority === 'Low priority' ? 'bg-yellow-100 text-yellow-700' : ''}
                        `}
                        >
                        {initiative.priority}
                        </div>
                    </div>
                    </div>

                    <div className='space-y-2'>
                    <p className="text-allGray font-popReg text-sm underline">{initiative.organizer}</p>
                    <p className="text-allGray font-popReg text-sm mb-6 leading-relaxed">{initiative.description}</p>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm mb-6 font-popReg">
                    <CalendarDays size={16} className="mr-2" /> {initiative.date}
                    <Users size={16} className="ml-6 mr-2" /> {initiative.participants}
                    </div>

                    <div className="flex space-x-3">
                    <MainButton
                        className="primarybtn text-white font-popReg"
                        onClick={() => console.log(`Join Initiative ${initiative.id} clicked`)}
                        ariaLabel={`Join ${initiative.name} initiative`}
                        id={`joinInitiativeBtn-${initiative.id}`}
                        dataTestId={`join-initiative-button-${initiative.id}`}
                    >
                        Join initiative
                    </MainButton>
                    <MainButton
                        className="bg-gray-200 text-gray-700 hover:bg-gray-300 font-popReg"
                        onClick={() => console.log(`View details for ${initiative.id} clicked`)}
                        ariaLabel={`View details for ${initiative.name}`}
                        id={`viewDetailsBtn-${initiative.id}`}
                        dataTestId={`view-details-button-${initiative.id}`}
                    >
                        View details
                    </MainButton>
                    </div>
                </div>
                ))}
            </div>
            ) : (
            <div className="text-center py-16 text-allGray font-popLight text-lg">
                No initiatives match your current filters.
            </div>
            )}
        
      </main>
    </div>
  );
};

export default NearbyInitiatives;